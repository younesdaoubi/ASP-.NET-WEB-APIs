import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/list.css'; // Import des styles spécifiques

const ConstellationList = () => {
  const [constellations, setConstellations] = useState([]);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // État pour l'ordre de tri
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConstellations = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/constellations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setConstellations(response.data);
      } catch (error) {
        console.error('Erreur de chargement des constellations!', error);
        setError('Erreur lors de la récupération des constellations.');
      }
    };

    fetchConstellations();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette constellation ?')) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await axios.delete(`https://localhost:7162/api/constellations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setConstellations(constellations.filter(constellation => constellation.id !== id));
      } catch (error) {
        console.error('Erreur de suppression!', error);
        setError('Erreur lors de la suppression de la constellation.');
      }
    }
  };

  const handleSort = () => {
    const sortedConstellations = [...constellations].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setConstellations(sortedConstellations);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Inverse l'ordre de tri
  };

  return (
    <div className="container">
      <h1>Liste des Constellations</h1>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <Link to="/constellations/add" className="add-link">Ajouter une Constellation</Link>
        <button onClick={handleSort} className="add-link">
          Trier par nom ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
        </button>
      </div>
      <ul className="item-list">
        {constellations.map(constellation => (
          <li key={constellation.id} className="item-list-item">
            {constellation.imageUrl && (
              <Link to={`/constellations/details/${constellation.id}`} className="item-image-link">
                <img
                  src={constellation.imageUrl}
                  alt={constellation.name}
                  className="item-image"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
              </Link>
            )}
            <div className="item-details">
              <h2>{constellation.name}</h2>
              <p><strong>Description :</strong> {constellation.description}</p>
              <p><strong>Coordonnée X :</strong> {constellation.xCoordinate}</p>
              <p><strong>Coordonnée Y :</strong> {constellation.yCoordinate}</p>
              <p><strong>Coordonnée Z :</strong> {constellation.zCoordinate}</p>
              <div className="item-actions">
                <Link to={`/constellations/details/${constellation.id}`} className="details-button">Détails</Link>
                <Link to={`/constellations/edit/${constellation.id}`} className="modify-button">Modifier</Link>
                <button onClick={() => handleDelete(constellation.id)} className="delete-button">Supprimer</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConstellationList;
