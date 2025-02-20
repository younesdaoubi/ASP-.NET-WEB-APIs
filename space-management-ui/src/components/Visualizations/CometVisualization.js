import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const createComet = (tailColor) => {
  // Define head and tail colors
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

const CometVisualization = ({ tailColor, onHover }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000); // Set background color to black

    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    // Create comet and add to scene
    const comet = createComet(tailColor);
    scene.add(comet);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Set camera position
    camera.position.z = 10;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

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
        onHover({
          name: 'Comet',
          coords: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}`,
          visible: true,
          x: event.clientX,
          y: event.clientY,
        });
      } else {
        onHover({ name: '', coords: '', visible: false, x: 0, y: 0 });
      }
    };

    mountNode.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      comet.rotation.y += 0.01; // Rotate the comet for a simple effect
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
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [tailColor, onHover]);

  return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />;
};

export default CometVisualization;
