import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';

const AllAliensMap = () => {
  const [aliens, setAliens] = useState([]);
  const mountRef = useRef(null);

  useEffect(() => {
    const fetchAliens = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) return;

      try {
        const response = await axios.get('https://localhost:7162/api/aliens', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAliens(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des aliens', error);
      }
    };

    fetchAliens();
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

      // Set position of the entire group
      alienGroup.position.set(x, y, z);

      // Add the group to the scene
      scene.add(alienGroup);
    };

    // Create and add all aliens to the scene
    aliens.forEach(alien => {
      createAlien(alien.xCoordinate, alien.yCoordinate, alien.zCoordinate);
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
  }, [aliens]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '500px', position: 'relative' }}>
    </div>
  );
};

export default AllAliensMap;
