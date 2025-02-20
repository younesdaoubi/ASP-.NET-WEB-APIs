import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';

// Import des textures
import earthTextureUrl from '../../textures/earth.jpg';
import jupiterTextureUrl from '../../textures/jupiter.jpg';
import marsTextureUrl from '../../textures/mars.jpg';
import mercureTextureUrl from '../../textures/mercure.jpg';
import moonTextureUrl from '../../textures/moon.jpg';
import neptuneTextureUrl from '../../textures/neptune.jpg';
import uranusTextureUrl from '../../textures/uranus.jpg';
import venusTextureUrl from '../../textures/venus.jpg';

// Fonction pour obtenir la texture en fonction de surfaceTexture
const getTextureBySurface = (surfaceTexture) => {
  if (!surfaceTexture) {
    console.warn('surfaceTexture is null or undefined, defaulting to earth texture.');
    return earthTextureUrl; // Texture par défaut
  }

  switch(surfaceTexture.toLowerCase()) {
    case 'terre':
      return earthTextureUrl;
    case 'jupiter':
      return jupiterTextureUrl;
    case 'mars':
      return marsTextureUrl;
    case 'mercure':
      return mercureTextureUrl;
    case 'moon':
      return moonTextureUrl;
    case 'neptune':
      return neptuneTextureUrl;
    case 'uranus':
      return uranusTextureUrl;
    case 'venus':
      return venusTextureUrl;
    default:
      console.warn(`Unknown surfaceTexture: ${surfaceTexture}, defaulting to earth texture.`);
      return venusTextureUrl; // Texture par défaut en cas de valeur inconnue
  }
};

const AllPlanetsMap = () => {
  const mountRef = useRef(null);
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredInfo, setHoveredInfo] = useState({ name: '', coords: '', visible: false, x: 0, y: 0 });

  useEffect(() => {
    const fetchPlanets = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token d\'authentification manquant');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/planets', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Planets data:', response.data); // Debug: log the planets data
        setPlanets(response.data);
      } catch (error) {
        console.error('Erreur de chargement des planètes!', error);
        setError('Erreur lors de la récupération des planètes.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanets();
  }, []);

  useEffect(() => {
    if (planets.length === 0) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Get the current DOM node from ref
    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    // Create a container for all planets
    const planetsGroup = new THREE.Group();
    scene.add(planetsGroup);

    // Function to create a planet
    const createPlanet = (planet) => {
      const planetTextureUrl = getTextureBySurface(planet.surfaceTexture);
      const textureLoader = new THREE.TextureLoader();
      const planetTexture = textureLoader.load(planetTextureUrl);

      const geometry = new THREE.SphereGeometry(5, 32, 32); // Fixed radius
      const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        roughness: 0.2, // Increased shininess
        metalness: 0.5, // Increased metalness
      });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(planet.xCoordinate, planet.yCoordinate, planet.zCoordinate);
      sphere.userData = { name: planet.name, coordinates: { x: planet.xCoordinate, y: planet.yCoordinate, z: planet.zCoordinate } }; // Store planet data in userData
      return sphere;
    };

    // Remove existing planets from the scene if any
    while (planetsGroup.children.length) {
      planetsGroup.remove(planetsGroup.children[0]);
    }

    // Position planets based on their coordinates
    planets.forEach(planet => {
      const planetMesh = createPlanet(planet);
      planetsGroup.add(planetMesh);
    });

    // Set camera position to center on the planets
    const center = new THREE.Vector3();
    planets.forEach(planet => {
      center.add(new THREE.Vector3(planet.xCoordinate, planet.yCoordinate, planet.zCoordinate));
    });
    center.divideScalar(planets.length);
    camera.position.copy(center).add(new THREE.Vector3(0, 0, 50)); // Position camera 50 units away from the center
    camera.lookAt(center);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Soft white light, increased intensity
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 2, 100); // White light, increased intensity
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Damping for smooth control
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Raycaster and mouse vector
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Update raycaster on mouse move
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections
      const intersects = raycaster.intersectObjects(planetsGroup.children);
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

    window.addEventListener('mousemove', onMouseMove);

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

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [planets]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <p>Loading planets...</p>}
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
          transform: 'translate(-50%, -50%)'
        }}>
          <strong>{hoveredInfo.name}</strong><br />
          {hoveredInfo.coords}
        </div>
      )}
    </div>
  );
};

export default AllPlanetsMap;
