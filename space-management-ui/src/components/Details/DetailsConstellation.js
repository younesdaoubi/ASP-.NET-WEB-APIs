import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ConstellationVisualization from '../Visualizations/ConstellationVisualization';  

const DetailsConstellation = () => {
  const { id } = useParams();
  const [constellation, setConstellation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConstellation = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/constellations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setConstellation(response.data);
      } catch (error) {
        console.error('Erreur de chargement de la constellation!', error);
        setError('Erreur lors de la récupération de la constellation.');
      }
    };

    fetchConstellation();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!constellation) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Détails de la Constellation</h1>
      <img
        src={constellation.imageUrl || 'https://via.placeholder.com/600'}
        alt={constellation.name}
        style={{ width: '600px', height: '600px', objectFit: 'cover', marginBottom: '20px' }}
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600'; }}
      />
      <div>
        <h2>{constellation.name}</h2>
        <p><strong>Description :</strong> {constellation.description}</p>
        <p><strong>Coordonnée X :</strong> {constellation.xCoordinate}</p>
        <p><strong>Coordonnée Y :</strong> {constellation.yCoordinate}</p>
        <p><strong>Coordonnée Z :</strong> {constellation.zCoordinate}</p>
        <p><strong>Étoiles Principales :</strong> {constellation.mainStars}</p>
        <p><strong>Meilleurs Mois d'Observation :</strong> {constellation.bestViewingMonths}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Visualisation 3D de la constellation {constellation.name}</h3>
        <div style={{ width: '400px', height: '400px' }}>
          <ConstellationVisualization constellation={constellation} />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link to={`/constellations/edit/${constellation.id}`} style={{ marginRight: '10px' }}>Modifier</Link>
        <Link to="/constellations">Retour à la liste</Link>
      </div>
    </div>
  );
};

export default DetailsConstellation;
