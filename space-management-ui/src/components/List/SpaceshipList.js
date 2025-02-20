import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/list.css';  

const SpaceshipList = () => {
  const [spaceships, setSpaceships] = useState([]);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // État pour l'ordre de tri
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaceships = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/spaceships', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSpaceships(response.data);
      } catch (error) {
        console.error('Erreur de chargement des vaisseaux spatiaux!', error);
        setError('Erreur lors de la récupération des vaisseaux spatiaux.');
      }
    };

    fetchSpaceships();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce vaisseau spatial ?')) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await axios.delete(`https://localhost:7162/api/spaceships/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSpaceships(spaceships.filter(spaceship => spaceship.id !== id));
      } catch (error) {
        console.error('Erreur de suppression!', error);
        setError('Erreur lors de la suppression du vaisseau spatial.');
      }
    }
  };

  const handleSort = () => {
    const sortedSpaceships = [...spaceships].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setSpaceships(sortedSpaceships);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Inverse l'ordre de tri
  };

  return (
    <div className="container">
      <h1>Liste des Vaisseaux Spatiaux</h1>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <Link to="/spaceships/add" className="add-link">Ajouter un Vaisseau Spatial</Link>
        <button onClick={handleSort} className="add-link">
          Trier par nom ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
        </button>
      </div>
      <ul className="item-list">
        {spaceships.map(spaceship => (
          <li key={spaceship.id} className="item-list-item">
            {spaceship.imageUrl && (
              <Link to={`/spaceships/details/${spaceship.id}`} className="item-image-link">
                <img
                  src={spaceship.imageUrl}
                  alt={spaceship.name}
                  className="item-image"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
              </Link>
            )}
            <div className="item-details">
              <h2>{spaceship.name}</h2>
              <p><strong>Description :</strong> {spaceship.description}</p>
              <p><strong>Coordonnée X :</strong> {spaceship.xCoordinate}</p>
              <p><strong>Coordonnée Y :</strong> {spaceship.yCoordinate}</p>
              <p><strong>Coordonnée Z :</strong> {spaceship.zCoordinate}</p>
              <div className="item-actions">
                <Link to={`/spaceships/details/${spaceship.id}`} className="details-button">Détails</Link>
                <Link to={`/spaceships/edit/${spaceship.id}`} className="modify-button">Modifier</Link>
                <button onClick={() => handleDelete(spaceship.id)} className="delete-button">Supprimer</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpaceshipList;
