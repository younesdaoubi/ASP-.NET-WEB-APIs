import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CometVisualization from '../Visualizations/CometVisualization';

const DetailsComet = () => {
  const { id } = useParams();
  const [comet, setComet] = useState(null);
  const [error, setError] = useState('');
  const [hoveredInfo, setHoveredInfo] = useState({ name: '', coords: '', visible: false, x: 0, y: 0 });

  useEffect(() => {
    const fetchComet = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/comets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComet(response.data);
      } catch (error) {
        console.error('Erreur de chargement de la comète!', error);
        setError('Erreur lors de la récupération de la comète.');
      }
    };

    fetchComet();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!comet) return <p>Chargement...</p>;

  // Set tailColor to 'orange' if it is not 'blue'
  const tailColor = comet.tailColor === 'blue' ? 'blue' : 'orange';

  return (
    <div style={{ position: 'relative' }}>
      <h1>Détails de la Comète</h1>
      <img
        src={comet.imageUrl || 'https://via.placeholder.com/600'}
        alt={comet.name}
        style={{ width: '600px', height: '600px', objectFit: 'cover', marginBottom: '20px' }}
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600'; }}
      />
      <div>
        <h2>{comet.name}</h2>
        <p><strong>Description :</strong> {comet.description}</p>
        <p><strong>Coordonnée X :</strong> {comet.xCoordinate}</p>
        <p><strong>Coordonnée Y :</strong> {comet.yCoordinate}</p>
        <p><strong>Coordonnée Z :</strong> {comet.zCoordinate}</p>
        <p><strong>Prochaine Apparition :</strong> {new Date(comet.nextAppearance).toLocaleDateString()}</p>
        <p><strong>Couleur de la Queue :</strong> {comet.tailColor}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Visualisation 3D de la comète {comet.name}</h3>
        <div style={{ width: '400px', height: '400px' }}>
          <CometVisualization tailColor={tailColor} onHover={setHoveredInfo} />
        </div>
      </div>
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

export default DetailsComet;
