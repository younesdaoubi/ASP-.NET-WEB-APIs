import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/list.css'; 

const CometList = () => {
  const [comets, setComets] = useState([]);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // État pour l'ordre de tri
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComets = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7162/api/comets', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComets(response.data);
      } catch (error) {
        console.error('Erreur de chargement des comètes!', error);
        setError('Erreur lors de la récupération des comètes.');
      }
    };

    fetchComets();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette comète ?')) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await axios.delete(`https://localhost:7162/api/comets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComets(comets.filter(comet => comet.id !== id));
      } catch (error) {
        console.error('Erreur de suppression!', error);
        setError('Erreur lors de la suppression de la comète.');
      }
    }
  };

  const handleSort = () => {
    const sortedComets = [...comets].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setComets(sortedComets);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Inverse l'ordre de tri
  };

  return (
    <div className="container">
      <h1>Liste des Comètes</h1>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <Link to="/comets/add" className="add-link">Ajouter une Comète</Link>
        <button onClick={handleSort} className="add-link">
          Trier par nom ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
        </button>
      </div>
      <ul className="item-list">
        {comets.map(comet => (
          <li key={comet.id} className="item-list-item">
            {comet.imageUrl && (
              <Link to={`/comets/details/${comet.id}`} className="item-image-link">
                <img
                  src={comet.imageUrl}
                  alt={comet.name}
                  className="item-image"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                />
              </Link>
            )}
            <div className="item-details">
              <h2>{comet.name}</h2>
              <p><strong>Description :</strong> {comet.description}</p>
              <p><strong>Coordonnée X :</strong> {comet.xCoordinate}</p>
              <p><strong>Coordonnée Y :</strong> {comet.yCoordinate}</p>
              <p><strong>Coordonnée Z :</strong> {comet.zCoordinate}</p>
              <div className="item-actions">
                <Link to={`/comets/details/${comet.id}`} className="details-button">Voir détails</Link>
                <Link to={`/comets/edit/${comet.id}`} className="modify-button">Modifier</Link>
                <button onClick={() => handleDelete(comet.id)} className="delete-button">Supprimer</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CometList;
