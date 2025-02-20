import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/list.css';  

const MoonList = () => {
  const [moons, setMoons] = useState([]);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // État pour l'ordre de tri

  useEffect(() => {
    const fetchMoons = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/moons', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMoons(response.data);
      } catch (error) {
        console.error('Erreur de chargement des lunes!', error);
        setError('Erreur lors de la récupération des lunes.');
      }
    };

    fetchMoons();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette lune ?')) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        await axios.delete(`https://localhost:7162/api/moons/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMoons(moons.filter(moon => moon.id !== id));
      } catch (error) {
        console.error('Erreur de suppression!', error);
        setError('Erreur lors de la suppression de la lune.');
      }
    }
  };

  const handleSort = () => {
    const sortedMoons = [...moons].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setMoons(sortedMoons);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Inverse l'ordre de tri
  };

  return (
    <div className="container">
      <h1>Liste des Lunes</h1>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <Link to="/moons/add" className="add-link">Ajouter une Lune</Link>
        <button onClick={handleSort} className="add-link">
          Trier par nom ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
        </button>
      </div>
      <ul className="item-list">
        {moons.map(moon => (
          <li key={moon.id} className="item-list-item">
            {moon.imageUrl && (
              <Link to={`/moons/details/${moon.id}`} className="planet-image-link">
                <img
                  src={moon.imageUrl}
                  alt={moon.name}
                  className="planet-image"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
              </Link>
            )}
            <div className="planet-details">
              <h2>{moon.name}</h2>
              <p><strong>Description :</strong> {moon.description}</p>
              <p><strong>Coordonnée X :</strong> {moon.xCoordinate}</p>
              <p><strong>Coordonnée Y :</strong> {moon.yCoordinate}</p>
              <p><strong>Coordonnée Z :</strong> {moon.zCoordinate}</p>
              <div className="planet-actions">
                <Link to={`/moons/details/${moon.id}`} className="details-button">Voir Détails</Link>
                <Link to={`/moons/edit/${moon.id}`} className="modify-button">Modifier</Link>
                <button onClick={() => handleDelete(moon.id)} className="delete-button">Supprimer</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoonList;
