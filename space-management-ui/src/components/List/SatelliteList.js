import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/list.css'; 

const SatelliteList = () => {
  const [satellites, setSatellites] = useState([]);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // État pour l'ordre de tri
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSatellites = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/satellites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSatellites(response.data);
      } catch (error) {
        console.error('Erreur de chargement des satellites!', error);
        setError('Erreur lors de la récupération des satellites.');
      }
    };

    fetchSatellites();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce satellite ?')) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await axios.delete(`https://localhost:7162/api/satellites/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSatellites(satellites.filter(satellite => satellite.id !== id));
      } catch (error) {
        console.error('Erreur de suppression!', error);
        setError('Erreur lors de la suppression du satellite.');
      }
    }
  };

  const handleSort = () => {
    const sortedSatellites = [...satellites].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setSatellites(sortedSatellites);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Inverse l'ordre de tri
  };

  return (
    <div className="container">
      <h1>Liste des Satellites</h1>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <Link to="/satellites/add" className="add-link">Ajouter un Satellite</Link>
        <button onClick={handleSort} className="add-link">
          Trier par nom ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
        </button>
      </div>
      <ul className="item-list">
        {satellites.map(satellite => (
          <li key={satellite.id} className="item-list-item">
            <img
              src={satellite.imageUrl || 'https://via.placeholder.com/150'}
              alt={satellite.name}
              className="planet-image"
              onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
            />
            <div className="planet-details">
              <h2>{satellite.name}</h2>
              <p><strong>Description :</strong> {satellite.description}</p>
              <p><strong>Coordonnée X :</strong> {satellite.xCoordinate}</p>
              <p><strong>Coordonnée Y :</strong> {satellite.yCoordinate}</p>
              <p><strong>Coordonnée Z :</strong> {satellite.zCoordinate}</p>
              <div className="planet-actions">
                <Link to={`/satellites/details/${satellite.id}`} className="details-button">Voir Détails</Link>
                <Link to={`/satellites/edit/${satellite.id}`} className="modify-button">Modifier</Link>
                <button onClick={() => handleDelete(satellite.id)} className="delete-button">Supprimer</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SatelliteList;
