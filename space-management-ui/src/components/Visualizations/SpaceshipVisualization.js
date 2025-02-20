import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SpaceshipVisualization = ({ spaceship }) => {
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

    // Create the main body of the spaceship (fuselage)
    const bodyGeometry = new THREE.ConeGeometry(2, 6, 32); // More aerodynamic fuselage
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White body
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2; // Rotate to make it horizontal
    scene.add(body);

    // Create wings (more detailed)
    const wingGeometry = new THREE.BoxGeometry(10, 0.5, 3); // Thin, wide box for wings
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White wings
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-5.5, 0, 0);
    rightWing.position.set(5.5, 0, 0);
    scene.add(leftWing);
    scene.add(rightWing);

    // Create tail (empennage)
    const tailGeometry = new THREE.ConeGeometry(1, 4, 32); // Smaller cone for tail
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White tail
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0, -4.5, 0);
    tail.rotation.x = Math.PI / 2; // Rotate to make it vertical
    scene.add(tail);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light, intensity, distance
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light for better shadows
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Set camera position
    camera.position.z = 20;

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

      // Update the raycaster to include all relevant objects
      const intersects = raycaster.intersectObjects([body, leftWing, rightWing, tail]);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const { x, y, z } = intersect.point;
        setHoveredInfo({
          name: spaceship.name, // Use the name from the spaceship prop
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
  }, [spaceship]);

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

export default SpaceshipVisualization;
