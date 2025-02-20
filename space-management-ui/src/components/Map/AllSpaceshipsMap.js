import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';

const AllSpaceshipsMap = () => {
  const [spaceships, setSpaceships] = useState([]);
  const mountRef = useRef(null);

  useEffect(() => {
    const fetchSpaceships = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) return;

      try {
        const response = await axios.get('https://localhost:7162/api/spaceships', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSpaceships(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des vaisseaux spatiaux', error);
      }
    };

    fetchSpaceships();
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
    const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light, intensity, distance
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light for better shadows
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Create and add spaceships to the scene
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

    spaceships.forEach(spaceship => {
      createSpaceship(spaceship.xCoordinate, spaceship.yCoordinate, spaceship.zCoordinate);
    });

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

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [spaceships]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '500px', position: 'relative' }}>
      {/* Optional: Add a UI to display additional information or interactions */}
    </div>
  );
};

export default AllSpaceshipsMap;
