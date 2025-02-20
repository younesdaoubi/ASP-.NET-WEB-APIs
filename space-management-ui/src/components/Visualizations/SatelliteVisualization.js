import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SatelliteVisualization = ({ satellite }) => {
  const mountRef = useRef(null);
  const [hoveredInfo, setHoveredInfo] = useState({ name: '', coords: '', visible: false });

  useEffect(() => {
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

    // Create satellite body
    const bodyGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow color
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2; // Align the body correctly
    scene.add(body);

    // Create satellite panels
    const panelGeometry = new THREE.BoxGeometry(0.2, 2, 0.5);
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Gray color for panels
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
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check for intersection with the satellite
      const intersects = raycaster.intersectObject(body);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const { x, y, z } = intersect.point;
        setHoveredInfo({
          name: satellite.name,
          coords: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}`,
          visible: true,
          x: event.clientX,
          y: event.clientY
        });
      } else {
        setHoveredInfo(prevInfo => ({ ...prevInfo, visible: false }));
      }
    };

    mountNode.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      body.rotation.y += 0.01; // Smooth rotation for the entire satellite
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
  }, [satellite]);

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
          <div><strong>{hoveredInfo.name}</strong></div>
          <div>{hoveredInfo.coords}</div>
        </div>
      )}
    </div>
  );
};

export default SatelliteVisualization;
