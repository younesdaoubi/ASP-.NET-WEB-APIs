import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import moonTextureUrl from '../../textures/moon.jpg';  

const MoonVisualization = ({ moon }) => {
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

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(moonTextureUrl); // Use the moon.jpg texture

    // Create a sphere geometry
    const geometry = new THREE.SphereGeometry(5, 64, 64); // Radius of 5, with 64 segments for better detail

    // Create material with texture
    const material = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.7,
      metalness: 0.0,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light, intensity, distance
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

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

      const intersects = raycaster.intersectObject(sphere);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const { x, y, z } = intersect.point;
        setHoveredInfo((prevInfo) => ({
          ...prevInfo,
          name: moon.name,
          coords: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}`,
          visible: true,
          x: event.clientX,
          y: event.clientY,
        }));
      } else {
        setHoveredInfo((prevInfo) => ({ ...prevInfo, visible: false }));
      }
    };

    mountNode.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.001; // Slow rotation for better visualization
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
  }, [moon]); // Dependency array only includes 'moon'

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

export default MoonVisualization;
