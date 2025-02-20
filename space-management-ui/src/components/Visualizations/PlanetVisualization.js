import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Import des textures
import earthTextureUrl from '../../textures/earth.jpg';
import jupiterTextureUrl from '../../textures/jupiter.jpg';
import marsTextureUrl from '../../textures/mars.jpg';
import mercureTextureUrl from '../../textures/mercure.jpg';
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
      return mercureTextureUrl; // Notez que c'est mercure et non mercure
    case 'neptune':
      return neptuneTextureUrl;
    case 'uranus':
      return uranusTextureUrl;
    case 'venus':
      return venusTextureUrl;
    default:
      return venusTextureUrl; // Texture par défaut
  }
};

const PlanetVisualization = ({ planet }) => {
  const mountRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [info, setInfo] = useState({ x: 0, y: 0, text: '' });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    // Chargement de la texture de la planète en fonction de surfaceTexture
    const planetTextureUrl = getTextureBySurface(planet.surfaceTexture);

    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load(planetTextureUrl, () => {
      console.log(`Texture ${planet.surfaceTexture} chargée avec succès.`);
    }, undefined, (error) => {
      console.error('Erreur lors du chargement de la texture:', error);
    });

    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.7,
      metalness: 0.0,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 20;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(sphere);

      if (intersects.length > 0) {
        setHovered(true);
        setInfo({
          x: event.clientX,
          y: event.clientY,
          text: `Nom: ${planet.name}, X: ${planet.xCoordinate}, Y: ${planet.yCoordinate}, Z: ${planet.zCoordinate}`,
        });
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      sphere.geometry.dispose();
      sphere.material.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, [planet]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '500px', position: 'relative' }}>
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: info.y,
            left: info.x,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {info.text}
        </div>
      )}
    </div>
  );
};

export default PlanetVisualization;
