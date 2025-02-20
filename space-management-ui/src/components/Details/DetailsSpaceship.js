import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import SpaceshipVisualization from '../Visualizations/SpaceshipVisualization'; 

const DetailsSpaceship = () => {
  const { id } = useParams(); // Récupère l'ID depuis les paramètres de l'URL
  const [spaceship, setSpaceship] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpaceship = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token JWT non trouvé. Veuillez vous connecter.');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/spaceships/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSpaceship(response.data);
      } catch (error) {
        console.error('Erreur de chargement du vaisseau spatial!', error.response ? error.response.data : error.message);
        setError('Erreur lors de la récupération du vaisseau spatial.');
      }
    };

    fetchSpaceship();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!spaceship) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Détails du Vaisseau Spatial</h1>
      <img
        src={spaceship.imageUrl || 'https://via.placeholder.com/600'}
        alt={spaceship.name}
        style={{ width: '600px', height: '600px', objectFit: 'cover', marginBottom: '20px' }}
        onError={(e) => e.target.src = 'https://via.placeholder.com/600'}
      />
      <div>
        <h2>{spaceship.name}</h2>
        <p><strong>Description :</strong> {spaceship.description}</p>
        <p><strong>Coordonnée X :</strong> {spaceship.xCoordinate}</p>
        <p><strong>Coordonnée Y :</strong> {spaceship.yCoordinate}</p>
        <p><strong>Coordonnée Z :</strong> {spaceship.zCoordinate}</p>
        <p><strong>Mission :</strong> {spaceship.mission}</p>
        <p><strong>Date de lancement :</strong> {new Date(spaceship.launchDate).toLocaleDateString()}</p>
        <p><strong>Date de retour :</strong> {new Date(spaceship.returnDate).toLocaleDateString()}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Visualisation 3D du vaisseau spatial {spaceship.name}</h3>
        <div style={{ width: '400px', height: '400px' }}>
          <SpaceshipVisualization spaceship={spaceship} />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link to={`/spaceships/edit/${spaceship.id}`} style={{ marginRight: '10px' }}>Modifier</Link>
        <Link to="/spaceships">Retour à la liste</Link>
      </div>
    </div>
  );
};

export default DetailsSpaceship;
