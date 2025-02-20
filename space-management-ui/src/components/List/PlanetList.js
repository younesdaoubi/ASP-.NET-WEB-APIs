import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/list.css';  

const PlanetList = () => {
  const [planets, setPlanets] = useState([]);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // État pour l'ordre de tri
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanets = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/planets', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPlanets(response.data);
      } catch (error) {
        console.error('Erreur de chargement des planètes!', error);
        setError('Erreur lors de la récupération des planètes.');
      }
    };

    fetchPlanets();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette planète ?')) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await axios.delete(`https://localhost:7162/api/planets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPlanets(planets.filter(planet => planet.id !== id));
      } catch (error) {
        console.error('Erreur de suppression!', error);
        setError('Erreur lors de la suppression de la planète.');
      }
    }
  };

  const handleSort = () => {
    const sortedPlanets = [...planets].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setPlanets(sortedPlanets);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Inverse l'ordre de tri
  };

  return (
    <div className="container">
      <h1>Liste des Planètes</h1>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <Link to="/planets/add" className="add-link">Ajouter une Planète</Link>
        <button onClick={handleSort} className="add-link">
          Trier par nom ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
        </button>
      </div>
      <ul className="item-list">
        {planets.map(planet => (
          <li key={planet.id} className="planet-item">
            {planet.imageUrl && (
              <Link to={`/planets/details/${planet.id}`} className="planet-image-link">
                <img
                  src={planet.imageUrl}
                  alt={planet.name}
                  className="planet-image"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
              </Link>
            )}
            <div className="planet-details">
              <h2>{planet.name}</h2>
              <p><strong>Description :</strong> {planet.description}</p>
              <p><strong>Coordonnée X :</strong> {planet.xCoordinate}</p>
              <p><strong>Coordonnée Y :</strong> {planet.yCoordinate}</p>
              <p><strong>Coordonnée Z :</strong> {planet.zCoordinate}</p>
              <p>
                <strong>Supporte la vie :</strong>
                {planet.supportsLife ? (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>✓</span>
                ) : (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>✗</span>
                )}
              </p>
              <div className="planet-actions">
                <Link to={`/planets/details/${planet.id}`} className="details-button">Détails</Link>
                <Link to={`/planets/edit/${planet.id}`} className="modify-button">Modifier</Link>
                <button onClick={() => handleDelete(planet.id)} className="delete-button">Supprimer</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanetList;
