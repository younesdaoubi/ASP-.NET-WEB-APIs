import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AlienVisualization from '../Visualizations/AlienVisualization'; // Importer le composant

const DetailsAlien = () => {
  const { id } = useParams(); // Récupère l'ID depuis les paramètres de l'URL
  const [alien, setAlien] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlien = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token JWT non trouvé. Veuillez vous connecter.');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/aliens/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAlien(response.data);
      } catch (error) {
        console.error('Erreur de chargement des détails de l\'alien!', error.response ? error.response.data : error.message);
        setError('Erreur lors du chargement des détails de l\'alien.');
      }
    };

    fetchAlien();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!alien) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Détails de l'Alien</h1>
      <img
        src={alien.imageUrl || 'https://via.placeholder.com/600'}
        alt={alien.name}
        style={{ width: '600px', height: '600px', objectFit: 'cover', marginBottom: '20px' }}
        onError={(e) => e.target.src = 'https://via.placeholder.com/600'}
      />
      <div>
        <h2>{alien.name}</h2>
        <p><strong>Description :</strong> {alien.description}</p>
        <p><strong>Coordonnée X :</strong> {alien.xCoordinate}</p>
        <p><strong>Coordonnée Y :</strong> {alien.yCoordinate}</p>
        <p><strong>Coordonnée Z :</strong> {alien.zCoordinate}</p>
        <p><strong>Planète d'origine :</strong> {alien.originPlanet}</p>
        <p><strong>Amical :</strong> 
          {alien.isFriendly 
            ? <span style={{ color: 'green' }}>✔</span> 
            : <span style={{ color: 'red' }}>✘</span>}
        </p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Visualisation 3D de l'alien {alien.name}</h3>
        <div style={{ width: '400px', height: '400px' }}>
          <AlienVisualization alien={alien} />
        </div>
      </div>
    </div>
  );
};

export default DetailsAlien;
