import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PlanetVisualization from '../Visualizations/PlanetVisualization';

const DetailsPlanete = () => {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlanet = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('Token JWT non trouvé. Veuillez vous connecter.');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/planets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPlanet(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement de la planète!', error.response ? error.response.data : error.message);
        setError('Erreur lors de la récupération des détails de la planète.');
      }
    };

    fetchPlanet();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!planet) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Détails de la Planète</h1>
      <img
        src={planet.imageUrl || 'https://via.placeholder.com/150'}
        alt={planet.name}
        style={{ width: '600px', height: '600px', objectFit: 'cover', marginBottom: '20px' }}
      />
      <div>
        <h2>{planet.name}</h2>
        <p><strong>Description :</strong> {planet.description}</p>
        <p><strong>Coordonnée X :</strong> {planet.xCoordinate}</p>
        <p><strong>Coordonnée Y :</strong> {planet.yCoordinate}</p>
        <p><strong>Coordonnée Z :</strong> {planet.zCoordinate}</p>
        <p><strong>Diamètre :</strong> {planet.diameter} km</p>
        <p><strong>Masse :</strong> {planet.mass} kg</p>
        <p><strong>Distance du Soleil :</strong> {planet.distanceFromSun} millions de km</p>
        <p><strong>Texture de Surface :</strong> {planet.surfaceTexture}</p>
        <p>
          <strong>Possède un anneau :</strong>
          {planet.hasRings ? (
            <span style={{ color: 'green', fontWeight: 'bold' }}>✓</span>
          ) : (
            <span style={{ color: 'red', fontWeight: 'bold' }}>✗</span>
          )}
        </p>
        <p>
          <strong>Supporte la vie :</strong>
          {planet.supportsLife ? (
            <span style={{ color: 'green', fontWeight: 'bold' }}>✓</span>
          ) : (
            <span style={{ color: 'red', fontWeight: 'bold' }}>✗</span>
          )}
        </p>
      </div>
      <div style={{ marginTop: '20px' }}>
        {/* Titre de la visualisation */}
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Visualisation 3D de la planète {planet.name}</h3>
        {/* Taille réduite pour la visualisation */}
        <div style={{ width: '400px', height: '400px' }}>
          <PlanetVisualization planet={planet} />
        </div>
      </div>
    </div>
  );
};

export default DetailsPlanete;
