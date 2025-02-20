import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import axios from 'axios';

const AllSatellitesMap = () => {
  const mountRef = useRef(null);
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredInfo, setHoveredInfo] = useState({ name: '', coords: '', visible: false, x: 0, y: 0 });

  useEffect(() => {
    const fetchSatellites = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token d\'authentification manquant');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/satellites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Satellites data:', response.data);
        setSatellites(response.data);
      } catch (error) {
        console.error('Erreur de chargement des satellites!', error);
        setError('Erreur lors de la récupération des satellites.');
      } finally {
        setLoading(false);
      }
    };

    fetchSatellites();
  }, []);

  useEffect(() => {
    if (satellites.length === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }

    const satellitesGroup = new THREE.Group();
    scene.add(satellitesGroup);

    const createSatellite = (x, y, z, name) => {
      const bodyGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;

      const panelGeometry = new THREE.BoxGeometry(0.2, 2, 0.5);
      const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
      const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
      const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);

      panel1.position.set(0, 0, 1.5);
      panel2.position.set(0, 0, -1.5);

      body.add(panel1);
      body.add(panel2);

      const antennaGeometry = new THREE.ConeGeometry(0.1, 1, 32);
      const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
      const antenna1 = new THREE.Mesh(antennaGeometry, antennaMaterial);
      const antenna2 = new THREE.Mesh(antennaGeometry, antennaMaterial);

      antenna1.position.set(1.5, 0, 0);
      antenna2.position.set(-1.5, 0, 0);
      antenna1.rotation.y = Math.PI / 4;
      antenna2.rotation.y = -Math.PI / 4;

      body.add(antenna1);
      body.add(antenna2);

      body.position.set(x, y, z);
      body.userData = { name, coordinates: { x, y, z } };
      return body;
    };

    while (satellitesGroup.children.length) {
      satellitesGroup.remove(satellitesGroup.children[0]);
    }

    satellites.forEach(satellite => {
      const satelliteMesh = createSatellite(satellite.xCoordinate, satellite.yCoordinate, satellite.zCoordinate, satellite.name);
      satellitesGroup.add(satelliteMesh);
    });

    const center = new THREE.Vector3();
    satellites.forEach(satellite => {
      center.add(new THREE.Vector3(satellite.xCoordinate, satellite.yCoordinate, satellite.zCoordinate));
    });
    center.divideScalar(satellites.length);

    camera.position.copy(center).add(new THREE.Vector3(0, 0, 100));
    camera.lookAt(center);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const animate = () => {
      requestAnimationFrame(animate);
      satellitesGroup.rotation.y += 0.001;
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

    const handleMouseMove = (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(satellitesGroup.children);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject && intersectedObject.userData && intersectedObject.userData.coordinates) {
          const { name, coordinates } = intersectedObject.userData;
          setHoveredInfo({
            name: name || 'Unknown Satellite',
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

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [satellites]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <p>Loading satellites...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div ref={mountRef} style={{ width: '100%', height: '500px' }}></div>
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

export default AllSatellitesMap;
