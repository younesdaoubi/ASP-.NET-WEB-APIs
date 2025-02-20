import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Edit.css';  

const EditAlien = () => {
  const { id } = useParams();
  const [alien, setAlien] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlien = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/aliens/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAlien(response.data);
      } catch (error) {
        console.error('Erreur de chargement!', error);
        setError('Erreur de chargement des données.');
      }
    };

    fetchAlien();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAlien({
      ...alien,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.put(`https://localhost:7162/api/aliens/${id}`, alien, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => navigate('/aliens'))
      .catch(error => {
        console.error('Erreur de modification!', error);
        setError('Erreur lors de la modification de l\'alien.');
      });
  };

  if (error) return <div className="error">{error}</div>;

  if (!alien) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h1>Modifier un Alien</h1>
      <form className="edit-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" value={alien.name || ''} onChange={handleChange} placeholder="Nom" required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={alien.description || ''} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" value={alien.xCoordinate || ''} onChange={handleChange} placeholder="Coordonnée X" />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" value={alien.yCoordinate || ''} onChange={handleChange} placeholder="Coordonnée Y" />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" value={alien.zCoordinate || ''} onChange={handleChange} placeholder="Coordonnée Z" />

        <label htmlFor="originPlanet">Planète d'origine</label>
        <input id="originPlanet" name="originPlanet" value={alien.originPlanet || ''} onChange={handleChange} placeholder="Planète d'origine" />

        <label htmlFor="isFriendly">
          Amical:
          <input id="isFriendly" name="isFriendly" type="checkbox" checked={alien.isFriendly || false} onChange={handleChange} />
        </label>

        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default EditAlien;
