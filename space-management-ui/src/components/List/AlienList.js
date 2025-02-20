import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/list.css';  

const AlienList = () => {
  const [aliens, setAliens] = useState([]);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // État pour l'ordre de tri
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAliens = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/aliens', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAliens(response.data);
      } catch (error) {
        console.error('Erreur de chargement des aliens!', error);
        setError('Erreur lors de la récupération des aliens.');
      }
    };

    fetchAliens();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet alien ?')) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await axios.delete(`https://localhost:7162/api/aliens/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAliens(aliens.filter(alien => alien.id !== id));
      } catch (error) {
        console.error('Erreur de suppression!', error);
        setError('Erreur lors de la suppression de l\'alien.');
      }
    }
  };

  const handleSort = () => {
    const sortedAliens = [...aliens].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setAliens(sortedAliens);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Inverse l'ordre de tri
  };

  return (
    <div className="container">
      <h1>Liste des Aliens</h1>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <Link to="/aliens/add" className="add-link">Ajouter un Alien</Link>
        <button onClick={handleSort} className="add-link">
          Trier par nom ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
        </button>
      </div>
      <ul className="item-list">
        {aliens.map(alien => (
          <li key={alien.id} className="item-list-item">
            {alien.imageUrl && (
              <Link to={`/aliens/details/${alien.id}`} className="item-image-link">
                <img
                  src={alien.imageUrl}
                  alt={alien.name}
                  className="item-image"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
              </Link>
            )}
            <div className="item-details">
              <h2>{alien.name}</h2>
              <p><strong>Description :</strong> {alien.description}</p>
              <p><strong>Coordonnée X :</strong> {alien.xCoordinate}</p>
              <p><strong>Coordonnée Y :</strong> {alien.yCoordinate}</p>
              <p><strong>Coordonnée Z :</strong> {alien.zCoordinate}</p>
              <div className="item-actions">
                <Link to={`/aliens/details/${alien.id}`} className="details-button">Détails</Link>
                <Link to={`/aliens/edit/${alien.id}`} className="modify-button">Modifier</Link>
                <button onClick={() => handleDelete(alien.id)} className="delete-button">Supprimer</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlienList;
