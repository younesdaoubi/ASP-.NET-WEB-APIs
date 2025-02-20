import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Edit.css'; // Assurez-vous d'utiliser les styles CSS appropriés

const AddConstellation = () => {
  const [constellation, setConstellation] = useState({
    name: '',
    description: '',
    xCoordinate: '',
    yCoordinate: '',
    zCoordinate: '',
    mainStars: '',
    bestViewingMonths: '',
    imageUrl: ''  // Ajout du champ ImageUrl
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConstellation(prevConstellation => ({
      ...prevConstellation,
      [name]: name.includes('Coordinate') ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('https://localhost:7162/api/constellations', constellation, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/constellations');
    } catch (error) {
      console.error('Erreur d\'ajout!', error.response ? error.response.data : error.message);
      setError('Erreur lors de l\'ajout de la constellation.');
    }
  };

  return (
    <div className="container">
      <h1>Ajouter une Constellation</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" value={constellation.name} onChange={handleChange} placeholder="Nom" required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={constellation.description} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" value={constellation.xCoordinate} onChange={handleChange} placeholder="Coordonnée X" />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" value={constellation.yCoordinate} onChange={handleChange} placeholder="Coordonnée Y" />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" value={constellation.zCoordinate} onChange={handleChange} placeholder="Coordonnée Z" />

        <label htmlFor="mainStars">Étoiles Principales</label>
        <input id="mainStars" name="mainStars" value={constellation.mainStars} onChange={handleChange} placeholder="Étoiles Principales" />

        <label htmlFor="bestViewingMonths">Meilleurs Mois pour Observation</label>
        <input id="bestViewingMonths" name="bestViewingMonths" value={constellation.bestViewingMonths} onChange={handleChange} placeholder="Meilleurs Mois pour Observation" />
 
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddConstellation;
