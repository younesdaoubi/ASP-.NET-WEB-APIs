import React, { useState, useEffect, useRef } from 'react';
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
      return earthTextureUrl; // Texture par défaut
  }
};


// Function to create a gradient texture
const createGradientTexture = (size, color1, color2) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  const gradient = context.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, new THREE.Color(color1).getStyle());
  gradient.addColorStop(1, new THREE.Color(color2).getStyle());

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return canvas;
};

// Function to create a comet
const createComet = (tailColor) => {
  const headColor = 0xFFFFFF; // White color for head
  const tailColors = {
    blue: [0x0000FF, 0x87CEFA], // Blue and light blue
    orange: [0xFFA500, 0xFF4500] // Orange and flame orange
  };

  const headMaterial = new THREE.MeshBasicMaterial({ color: headColor });

  // Create comet head (sphere)
  const headGeometry = new THREE.SphereGeometry(1, 32, 32);
  const head = new THREE.Mesh(headGeometry, headMaterial);

  // Validate tailColor
  if (!tailColors[tailColor]) {
    console.error(`Invalid tail color: ${tailColor}`);
    return head; // Return the head with no tail
  }

  const tailColor1 = tailColors[tailColor][0];
  const tailColor2 = tailColors[tailColor][1];

  // Create comet tail (particles with gradient effect)
  const tailGeometry = new THREE.BufferGeometry();
  const tailParticles = [];
  const numParticles = 1000;
  const textureSize = 512;
  const gradientTexture = new THREE.CanvasTexture(createGradientTexture(textureSize, tailColor1, tailColor2));
  
  const tailMaterial = new THREE.PointsMaterial({
    size: 0.1,
    map: gradientTexture,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending // Make sure particles blend well
  });

  for (let i = 0; i < numParticles; i++) {
    const x = (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 5;
    const z = (Math.random() - 0.5) * 5;
    tailParticles.push(x, y, z);
  }

  tailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(tailParticles, 3));
  const tail = new THREE.Points(tailGeometry, tailMaterial);

  head.add(tail);
  return head;
};


// Function to create a star geometry
const createStarGeometry = (radius, spikes, depth) => {
  const shape = new THREE.Shape();
  const angle = Math.PI / spikes;

  for (let i = 0; i < spikes * 2; i++) {
    const radiusCurrent = i % 2 === 0 ? radius : radius / 2;
    const x = radiusCurrent * Math.cos(i * angle);
    const y = radiusCurrent * Math.sin(i * angle);

    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  shape.lineTo(shape.getPoint(0).x, shape.getPoint(0).y); // Close the path

  const extrudeSettings = {
    steps: 1,
    depth: depth,
    bevelEnabled: false
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  return geometry;
};

// Function to create a constellation with multiple stars
const createConstellation = (name, x, y, z) => {
  const starGeometry = createStarGeometry(1, 5, 0.2); // Parameters for radius, spikes, and depth
  const starMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // White color for the stars
  const constellation = new THREE.Group();

  // Number of stars per constellation
  const numberOfStars = 4;
  const radius = 2; // Radius for positioning stars in a circle

  for (let i = 0; i < numberOfStars; i++) {
    const angle = (i / numberOfStars) * Math.PI * 2; // Calculate angle for each star
    const starX = x + radius * Math.cos(angle);
    const starY = y;
    const starZ = z + radius * Math.sin(angle);

    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(starX, starY, starZ);
    constellation.add(star);
  }

  constellation.userData = { name, coordinates: { x, y, z } };

  return constellation;
};




const AllCelestialObjectsMap = () => {
  const [moons, setMoons] = useState([]);
  const [aliens, setAliens] = useState([]);
  const [satellites, setSatellites] = useState([]);
  const [spaceships, setSpaceships] = useState([]);
  const [comets, setComets] = useState([]);
  const [constellations, setConstellations] = useState([]);
  const [planets, setPlanets] = useState([]); // Ajout des planètes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredInfo, setHoveredInfo] = useState({ name: '', coords: '', visible: false, x: 0, y: 0 });
  const mountRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token d\'authentification manquant');
        setLoading(false);
        return;
      }

      try {
        const [moonsResponse, aliensResponse, satellitesResponse, spaceshipsResponse, cometsResponse, constellationsResponse, planetsResponse] = await Promise.all([
          axios.get('https://localhost:7162/api/moons', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('https://localhost:7162/api/aliens', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('https://localhost:7162/api/satellites', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('https://localhost:7162/api/spaceships', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('https://localhost:7162/api/comets', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('https://localhost:7162/api/constellations', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('https://localhost:7162/api/planets', { headers: { 'Authorization': `Bearer ${token}` } }) // Ajout pour les planètes
        ]);

        setMoons(moonsResponse.data);
        setAliens(aliensResponse.data);
        setSatellites(satellitesResponse.data);
        setSpaceships(spaceshipsResponse.data);
        setComets(cometsResponse.data);
        setConstellations(constellationsResponse.data);
        setPlanets(planetsResponse.data); // Ajout pour les planètes
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading || error) return;

    const mountNode = mountRef.current;
    if (!mountNode) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000); // Set background color to black

    mountNode.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light, intensity, distance
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light for better shadows
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(moonTextureUrl);

    // Function to create and add moon to the scene
    const createMoon = (x, y, z) => {
      const moonGeometry = new THREE.SphereGeometry(60, 32, 32);
      const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(x, y, z);
      scene.add(moon);
    };

    // Function to create and add alien to the scene
const createAlien = (x, y, z) => {
  const alienGroup = new THREE.Group();

  // Create a cylinder geometry for the body
  const bodyGeometry = new THREE.CylinderGeometry(1, 1, 5, 32);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 2;
  alienGroup.add(body);

  // Create a sphere geometry for the head
  const headGeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 5.5;
  alienGroup.add(head);

  // Create cylinder geometries for the arms
  const armGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 32);
  const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(-2, 2, 0);
  rightArm.position.set(2, 2, 0);
  leftArm.rotation.z = Math.PI / 4;
  rightArm.rotation.z = -Math.PI / 4;
  alienGroup.add(leftArm);
  alienGroup.add(rightArm);

  // Create cylinder geometries for the legs
  const legGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-1, -2, 0);
  rightLeg.position.set(1, -2, 0);
  alienGroup.add(leftLeg);
  alienGroup.add(rightLeg);

  // Create two large spheres for the eyes
  const eyeGeometry = new THREE.SphereGeometry(0.6, 32, 32);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.6, 6, 1.1);
  rightEye.position.set(0.6, 6, 1.1);
  alienGroup.add(leftEye);
  alienGroup.add(rightEye);

  // Set position of the entire alien
  alienGroup.position.set(x, y, z);

  // Add the group to the scene
  scene.add(alienGroup);

  return { alienGroup, meshes: [body, head, leftArm, rightArm, leftLeg, rightLeg, leftEye, rightEye] };
};


    // Function to create and add satellite to the scene
    const createSatellite = (x, y, z, name) => {
      // Create satellite body
      const bodyGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow color
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2; // Align the body correctly
    
      // Create satellite panels
      const panelGeometry = new THREE.BoxGeometry(0.2, 2, 0.5);
      const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Gray color
      const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
      const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
      panel1.position.set(0, 0, 1.5);
      panel2.position.set(0, 0, -1.5);
      body.add(panel1);
      body.add(panel2);
    
      // Create antennas
      const antennaGeometry = new THREE.ConeGeometry(0.1, 1, 32);
      const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Darker gray
      const antenna1 = new THREE.Mesh(antennaGeometry, antennaMaterial);
      const antenna2 = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna1.position.set(1.5, 0, 0);
      antenna2.position.set(-1.5, 0, 0);
      antenna1.rotation.y = Math.PI / 4;
      antenna2.rotation.y = -Math.PI / 4;
      body.add(antenna1);
      body.add(antenna2);
    
      // Set position and add to scene
      body.position.set(x, y, z);
      body.userData = { name, coordinates: { x, y, z } };
      return body;
    };

    // Function to create and add spaceship to the scene
    const createSpaceship = (x, y, z) => {
      const spaceshipGroup = new THREE.Group();

      const bodyGeometry = new THREE.ConeGeometry(2, 6, 32); // Aerodynamic fuselage
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.x = Math.PI / 2;
      spaceshipGroup.add(body);

      const wingGeometry = new THREE.BoxGeometry(10, 0.5, 3);
      const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
      const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
      leftWing.position.set(-5.5, 0, 0);
      rightWing.position.set(5.5, 0, 0);
      spaceshipGroup.add(leftWing);
      spaceshipGroup.add(rightWing);

      const tailGeometry = new THREE.ConeGeometry(1, 4, 32);
      const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const tail = new THREE.Mesh(tailGeometry, tailMaterial);
      tail.position.set(0, -4.5, 0);
      tail.rotation.x = Math.PI / 2;
      spaceshipGroup.add(tail);

      // Set position of the entire group
      spaceshipGroup.position.set(x, y, z);

      // Add the group to the scene
      scene.add(spaceshipGroup);
    };


    // Function to create and add a planet to the scene
    const createPlanet = (planet) => {
      const planetTextureUrl = getTextureBySurface(planet.surfaceTexture);
      const planetTexture = textureLoader.load(planetTextureUrl);

      const geometry = new THREE.SphereGeometry(60, 32, 32); // Adjust radius if needed
      const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        roughness: 0.2,
        metalness: 0.5,
      });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(planet.xCoordinate, planet.yCoordinate, planet.zCoordinate);
      sphere.userData = { name: planet.name, coordinates: { x: planet.xCoordinate, y: planet.yCoordinate, z: planet.zCoordinate } }; // Store planet data in userData
      scene.add(sphere);
    };

    // Function to create and add comet to the scene
    const addCometToScene = (x, y, z, tailColor) => {
      const comet = createComet(tailColor);
      comet.position.set(x, y, z);
      scene.add(comet);
    };

    // Function to create and add constellation to the scene
    const addConstellationToScene = (name, x, y, z) => {
      const constellation = createConstellation(name, x, y, z);
      scene.add(constellation);
    };

    // Create celestial objects
    moons.forEach(moon => createMoon(moon.xCoordinate, moon.yCoordinate, moon.zCoordinate));
    aliens.forEach(alien => createAlien(alien.xCoordinate, alien.yCoordinate, alien.zCoordinate));
    satellites.forEach(satellite => { const satelliteMesh = createSatellite(satellite.xCoordinate, satellite.yCoordinate, satellite.zCoordinate, satellite.name); scene.add(satelliteMesh);});
    spaceships.forEach(spaceship => createSpaceship(spaceship.xCoordinate, spaceship.yCoordinate, spaceship.zCoordinate));
    comets.forEach(comet => addCometToScene(comet.xCoordinate, comet.yCoordinate, comet.zCoordinate, comet.tailColor)); // Ajout des comètes
    constellations.forEach(constellation => addConstellationToScene(constellation.name, constellation.xCoordinate, constellation.yCoordinate, constellation.zCoordinate)); // Ajout des constellations
    planets.forEach(planet => createPlanet(planet)); // Ajouter les planètes

    // Set camera position
    camera.position.z = 50;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enablePan = true;

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

    // Handle mouse move for hover info
    const handleMouseMove = (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject && intersectedObject.userData && intersectedObject.userData.coordinates) {
          const { name, coordinates } = intersectedObject.userData;
          setHoveredInfo({
            name: name || 'Unknown Object',
            coords: `X: ${coordinates.x.toFixed(2)}, Y: ${coordinates.y.toFixed(2)}, Z: ${coordinates.z.toFixed(2)}`,
            visible: true,
            x: event.clientX,
            y: event.clientY
          });
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
  }, [moons, aliens, satellites, spaceships, planets, comets, constellations, loading, error]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div ref={mountRef} style={{ width: '100%', height: '100vh', position: 'relative' }}></div>
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

export default AllCelestialObjectsMap;
