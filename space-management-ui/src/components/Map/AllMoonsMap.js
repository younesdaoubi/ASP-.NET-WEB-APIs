import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';
import moonTextureUrl from '../../textures/moon.jpg';  

const AllMoonsMap = () => {
  const mountRef = useRef(null);
  const [moons, setMoons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredInfo, setHoveredInfo] = useState({ name: '', coords: '', visible: false, x: 0, y: 0 });

  useEffect(() => {
    const fetchMoons = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token d\'authentification manquant');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/moons', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Moons data:', response.data); // Debug: log the moons data
        setMoons(response.data);
      } catch (error) {
        console.error('Erreur de chargement des lunes!', error);
        setError('Erreur lors de la récupération des lunes.');
      } finally {
        setLoading(false);
      }
    };

    fetchMoons();
  }, []);

  useEffect(() => {
    if (moons.length === 0) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Get the current DOM node from ref
    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(moonTextureUrl);

    // Create material with texture
    const material = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.7,
      metalness: 0.0,
    });

    // Create a container for all moons
    const moonsGroup = new THREE.Group();
    scene.add(moonsGroup);

    // Function to create a moon
    const createMoon = (x, y, z, name) => {
      const geometry = new THREE.SphereGeometry(5, 32, 32); // Fixed radius
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      sphere.userData = { name, coordinates: { x, y, z } };
      return sphere;
    };

    // Remove existing moons from the scene if any
    while (moonsGroup.children.length) {
      moonsGroup.remove(moonsGroup.children[0]);
    }

    // Position moons based on their coordinates
    moons.forEach(moon => {
      const moonMesh = createMoon(moon.xCoordinate, moon.yCoordinate, moon.zCoordinate, moon.name);
      moonsGroup.add(moonMesh);
    });

    // Set camera position to center on the moons
    const center = new THREE.Vector3();
    moons.forEach(moon => {
      center.add(new THREE.Vector3(moon.xCoordinate, moon.yCoordinate, moon.zCoordinate));
    });
    center.divideScalar(moons.length);

    camera.position.copy(center).add(new THREE.Vector3(0, 0, 50)); // Position camera 50 units away from the center
    camera.lookAt(center);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light, intensity, distance
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Damping for smooth control
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Handle mouse movement
    const handleMouseMove = (event) => {
      // Normalize mouse coordinates
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      // Update raycaster
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections
      const intersects = raycaster.intersectObjects(moonsGroup.children);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const { name, coordinates } = intersectedObject.userData;
        setHoveredInfo({
          name,
          coords: `X: ${coordinates.x.toFixed(2)}, Y: ${coordinates.y.toFixed(2)}, Z: ${coordinates.z.toFixed(2)}`,
          visible: true,
          x: event.clientX,
          y: event.clientY
        });
      } else {
        setHoveredInfo(prevInfo => ({ ...prevInfo, visible: false }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [moons]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <p>Loading moons...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div ref={mountRef} style={{ width: '100%', height: '500px' }}></div>
      {hoveredInfo.visible && (
        <div style={{
          position: 'absolute',
          top: `${hoveredInfo.y}px`,
          left: `${hoveredInfo.x}px`,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '5px',
          borderRadius: '5px',
          pointerEvents: 'none',
          transform: 'translate(-50%, -100%)'
        }}>
          <div><strong>{hoveredInfo.name}</strong></div>
          <div>{hoveredInfo.coords}</div>
        </div>
      )}
    </div>
  );
};

export default AllMoonsMap;
