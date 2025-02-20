import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';

const createStarShape = (constellationName) => {
  const shape = new THREE.Shape();
  const outerRadius = 0.5;
  const innerRadius = 0.2;
  const spikes = 5;

  for (let i = 0; i < spikes; i++) {
    const angle = (i / spikes) * Math.PI * 2;
    const outerX = Math.cos(angle) * outerRadius;
    const outerY = Math.sin(angle) * outerRadius;
    shape.lineTo(outerX, outerY);

    const nextAngle = ((i + 0.5) / spikes) * Math.PI * 2;
    const innerX = Math.cos(nextAngle) * innerRadius;
    const innerY = Math.sin(nextAngle) * innerRadius;
    shape.lineTo(innerX, innerY);
  }
  shape.lineTo(Math.cos(0) * outerRadius, Math.sin(0) * outerRadius); // close the shape

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity: 1 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.constellationName = constellationName; // Attach the constellation name to the star mesh
  return mesh;
};

const AllConstellationsMap = () => {
  const mountRef = useRef(null);
  const [constellations, setConstellations] = useState([]);
  const [error, setError] = useState('');
  const [hoveredInfo, setHoveredInfo] = useState({ name: '', coords: '', visible: false, x: 0, y: 0 });

  useEffect(() => {
    const fetchConstellations = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/constellations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setConstellations(response.data);
      } catch (error) {
        console.error('Erreur de chargement des constellations!', error);
        setError('Erreur lors de la récupération des constellations.');
      }
    };

    fetchConstellations();
  }, []);

  useEffect(() => {
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
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create and add constellations to the scene
    const createConstellation = (constellation) => {
      const { xCoordinate, yCoordinate, zCoordinate, name } = constellation;
      const offsets = [
        { dx: -1, dy: 1, dz: 0 }, // Offset for star 1
        { dx: 1, dy: 1, dz: 0 },  // Offset for star 2
        { dx: -1, dy: -1, dz: 0 },// Offset for star 3
        { dx: 1, dy: -1, dz: 0 }, // Offset for star 4
      ];

      offsets.forEach(offset => {
        const star = createStarShape(name);
        star.position.set(xCoordinate + offset.dx, yCoordinate + offset.dy, zCoordinate + offset.dz);
        scene.add(star);
      });
    };

    constellations.forEach(constellation => {
      createConstellation(constellation);
    });

    // Set camera position
    camera.position.z = 50;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enablePan = true;

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const { x, y, z } = intersect.point;
        const constellationName = intersect.object.userData.constellationName || 'Star';

        setHoveredInfo({
          name: constellationName,
          coords: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}`,
          visible: true,
          x: event.clientX,
          y: event.clientY,
        });
      } else {
        setHoveredInfo({ name: '', coords: '', visible: false, x: 0, y: 0 });
      }
    };

    mountNode.addEventListener('mousemove', onMouseMove);

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

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      mountNode.removeEventListener('mousemove', onMouseMove);
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [constellations]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh', position: 'relative' }}>
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

export default AllConstellationsMap;
