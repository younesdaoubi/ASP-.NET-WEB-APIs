import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import SatelliteVisualization from '../Visualizations/SatelliteVisualization';  

const DetailsSatellite = () => {
  const { id } = useParams(); // Récupère l'ID depuis les paramètres de l'URL
  const [satellite, setSatellite] = useState(null);
  const [planet, setPlanet] = useState(null); // État pour la planète associée
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSatellite = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token JWT non trouvé. Veuillez vous connecter.');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/satellites/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSatellite(response.data);

        // Fetch planet details if available
        if (response.data.planetId) {
          const planetResponse = await axios.get(`https://localhost:7162/api/planets/${response.data.planetId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setPlanet(planetResponse.data);
        }
      } catch (error) {
        console.error('Erreur de chargement du satellite!', error.response ? error.response.data : error.message);
        setError('Erreur lors de la récupération du satellite.');
      }
    };

    fetchSatellite();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!satellite) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Détails du Satellite</h1>
      <img
        src={satellite.imageUrl || 'https://via.placeholder.com/600'}
        alt={satellite.name}
        style={{ width: '600px', height: '600px', objectFit: 'cover', marginBottom: '20px' }}
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600'; }}
      />
      <div>
        <h2>{satellite.name}</h2>
        <p><strong>Description :</strong> {satellite.description}</p>
        <p><strong>Coordonnée X :</strong> {satellite.xCoordinate}</p>
        <p><strong>Coordonnée Y :</strong> {satellite.yCoordinate}</p>
        <p><strong>Coordonnée Z :</strong> {satellite.zCoordinate}</p>
        <p><strong>Type d'Orbite :</strong> {satellite.orbitType}</p>
        <p><strong>Date de Lancement :</strong> {new Date(satellite.launchDate).toLocaleDateString()}</p>
        <p><strong>Fonction :</strong> {satellite.function}</p>
      </div>
      {planet && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#1e90ff' }}>Planète Associée</h3>
          <p><strong>ID :</strong> {planet.id}</p>
          <p><strong>Nom :</strong> {planet.name}</p>
          <img
            src={planet.imageUrl || 'https://via.placeholder.com/100'}
            alt={planet.name}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              marginBottom: '10px',
              display: 'block',     // Ajouté pour centrer l'image
              marginLeft: 'auto',    
              marginRight: 'auto',   
            }}
            onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
          />
          <Link to={`/planets/details/${planet.id}`}>Voir Détails de la Planète</Link>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Visualisation 3D du satellite {satellite.name}</h3>
        <div style={{ width: '400px', height: '400px' }}>
          <SatelliteVisualization satellite={satellite} />
        </div>
      </div>
    </div>
  );
};

export default DetailsSatellite;
