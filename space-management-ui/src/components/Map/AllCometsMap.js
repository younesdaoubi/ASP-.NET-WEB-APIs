import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';
import { createComet } from '../Visualizations/CometVisualization';

const AllCometsMap = () => {
  const mountRef = useRef(null);
  const [comets, setComets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredInfo, setHoveredInfo] = useState({ name: '', coords: '', visible: false, x: 0, y: 0 });

  useEffect(() => {
    const fetchComets = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token d\'authentification manquant');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/comets', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Comets data:', response.data);
        setComets(response.data);
      } catch (error) {
        console.error('Erreur de chargement des comètes!', error);
        setError('Erreur lors de la récupération des comètes.');
      } finally {
        setLoading(false);
      }
    };

    fetchComets();
  }, []);

  useEffect(() => {
    if (comets.length === 0) return;

    // Setup the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Attach renderer to the DOM
    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    // Create a container for all comets
    const cometsGroup = new THREE.Group();
    scene.add(cometsGroup);

    // Clear existing comets if any
    while (cometsGroup.children.length) {
      cometsGroup.remove(cometsGroup.children[0]);
    }

    // Add comets to the scene using the createComet function
    comets.forEach(comet => {
      // Determine tail color
      const tailColor = comet.tailColor === 'blue' ? 'blue' : 'orange';
      const cometMesh = createComet(tailColor); // Pass the tail color to createComet
      cometMesh.position.set(comet.xCoordinate, comet.yCoordinate, comet.zCoordinate);
      cometMesh.userData = { name: comet.name, coordinates: { x: comet.xCoordinate, y: comet.yCoordinate, z: comet.zCoordinate } };
      cometsGroup.add(cometMesh);
    });

    // Center camera on the comets
    const center = new THREE.Vector3();
    comets.forEach(comet => {
      center.add(new THREE.Vector3(comet.xCoordinate, comet.yCoordinate, comet.zCoordinate));
    });
    center.divideScalar(comets.length);

    camera.position.copy(center).add(new THREE.Vector3(0, 0, 50));
    camera.lookAt(center);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
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
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(cometsGroup.children);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const userData = intersectedObject.userData;

        if (userData && userData.coordinates) {
          const { name, coordinates } = userData;
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
  }, [comets]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <p>Loading comets...</p>}
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

export default AllCometsMap;
