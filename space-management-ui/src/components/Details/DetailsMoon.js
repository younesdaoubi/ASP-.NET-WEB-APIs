import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import MoonVisualization from '../Visualizations/MoonVisualization'; // Importer le composant

const DetailsMoon = () => {
  const { id } = useParams(); // Récupère l'ID depuis les paramètres de l'URL
  const [moon, setMoon] = useState(null);
  const [planet, setPlanet] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMoon = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Token JWT non trouvé. Veuillez vous connecter.');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/moons/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMoon(response.data);

        // Fetch planet details
        if (response.data.planetId) {
          const planetResponse = await axios.get(`https://localhost:7162/api/planets/${response.data.planetId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setPlanet(planetResponse.data);
        }
      } catch (error) {
        console.error('Erreur de chargement des détails de la lune!', error.response ? error.response.data : error.message);
        setError('Erreur lors du chargement des détails de la lune.');
      }
    };

    fetchMoon();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!moon) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Détails de la Lune</h1>
      <img
        src={moon.imageUrl || 'https://via.placeholder.com/600'}
        alt={moon.name}
        style={{ width: '600px', height: '600px', objectFit: 'cover', marginBottom: '20px' }}
      />
      <div>
        <h2>{moon.name}</h2>
        <p><strong>Description :</strong> {moon.description}</p>
        <p><strong>Coordonnée X :</strong> {moon.xCoordinate}</p>
        <p><strong>Coordonnée Y :</strong> {moon.yCoordinate}</p>
        <p><strong>Coordonnée Z :</strong> {moon.zCoordinate}</p>
        <p><strong>Période orbitale :</strong> {moon.orbitalPeriod}</p>
        <p><strong>Distance de la planète :</strong> {moon.distanceFromPlanet}</p>
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
        display: 'block',     //  pour centrer l'image
        marginLeft: 'auto',    
        marginRight: 'auto',   
    }}
    onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
/>

          <Link to={`/planets/details/${planet.id}`}>Voir Détails de la Planète</Link>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Visualisation 3D de la lune {moon.name}</h3>
        <div style={{ width: '400px', height: '400px' }}>
          <MoonVisualization moon={moon} />
        </div>
      </div>
    </div>
  );
};

export default DetailsMoon;
