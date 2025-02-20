// src/components/AlienVisualization.js

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AlienVisualization = ({ alien }) => {
  const mountRef = useRef(null);
  const [hoveredInfo, setHoveredInfo] = useState({ name: '', coords: '', visible: false, x: 0, y: 0 });

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000); // Set background color to black

    // Get the current DOM node from ref
    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    // Create a cylinder geometry for the body
    const bodyGeometry = new THREE.CylinderGeometry(1, 1, 5, 32); // Radius top, Radius bottom, Height, Radial segments
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White body
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 2; // Position the body higher to make space for the head
    scene.add(body);

    // Create a sphere geometry for the head
    const headGeometry = new THREE.SphereGeometry(1.5, 32, 32); // Radius, Width segments, Height segments
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White head
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 5.5; // Position the head above the body
    scene.add(head);

    // Create cylinder geometries for the arms
    const armGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 32); // Radius top, Radius bottom, Height, Radial segments
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White arms
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-2, 2, 0); // Position the left arm
    rightArm.position.set(2, 2, 0); // Position the right arm
    leftArm.rotation.z = Math.PI / 4; // Rotate to make arms more natural
    rightArm.rotation.z = -Math.PI / 4; // Rotate to make arms more natural
    scene.add(leftArm);
    scene.add(rightArm);

    // Create cylinder geometries for the legs
    const legGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32); // Radius top, Radius bottom, Height, Radial segments
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White legs
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-1, -2, 0); // Position the left leg
    rightLeg.position.set(1, -2, 0); // Position the right leg
    scene.add(leftLeg);
    scene.add(rightLeg);

    // Create two large spheres for the eyes
    const eyeGeometry = new THREE.SphereGeometry(0.6, 32, 32); // Larger eyes
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black eyes
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.6, 6, 1.1); // Position the left eye
    rightEye.position.set(0.6, 6, 1.1); // Position the right eye
    scene.add(leftEye);
    scene.add(rightEye);

    // Create an array of all meshes to check for intersections
    const meshes = [body, head, leftArm, rightArm, leftLeg, rightLeg, leftEye, rightEye];

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light, intensity, distance
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Set camera position
    camera.position.z = 15;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Damping for smooth control
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enablePan = true; // Enable panning

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(meshes);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const { x, y, z } = intersect.point;
        setHoveredInfo({
          name: alien.name, // Use the name from the alien prop
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
      body.rotation.y += 0.01; // Slow rotation for better visualization
      head.rotation.y += 0.01;
      leftArm.rotation.z += 0.01;
      rightArm.rotation.z -= 0.01;
      leftLeg.rotation.z += 0.01;
      rightLeg.rotation.z -= 0.01;
      leftEye.rotation.y += 0.01; // Rotate eyes to add some dynamic effect
      rightEye.rotation.y -= 0.01; // Rotate eyes to add some dynamic effect
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
      mountNode.removeEventListener('mousemove', onMouseMove);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [alien]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '500px', position: 'relative' }}>
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
          <div>{hoveredInfo.name}</div>
          <div>{hoveredInfo.coords}</div>
        </div>
      )}
    </div>
  );
};

export default AlienVisualization;
