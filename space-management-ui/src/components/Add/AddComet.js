import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Edit.css'; // Assurez-vous d'utiliser les styles CSS appropriés

const AddComet = () => {
  const [comet, setComet] = useState({
    name: '',
    description: '',
    imageUrl: '',
    xCoordinate: 0,
    yCoordinate: 0,
    zCoordinate: 0,
    nextAppearance: '',
    tailColor: 'orange', // Valeur par défaut
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComet({
      ...comet,
      [name]: name.includes('Coordinate') ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('https://localhost:7162/api/comets', comet, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/comets');
    } catch (error) {
      console.error('Erreur d\'ajout de comète!', error.response ? error.response.data : error.message);
      setError('Erreur d\'ajout de comète! Veuillez vérifier les données et réessayer.');
    }
  };

  return (
    <div className="container">
      <h1>Ajouter une Comète</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" placeholder="Nom" onChange={handleChange} value={comet.name} required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" placeholder="Description" onChange={handleChange} value={comet.description} required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" placeholder="Coordonnée X" onChange={handleChange} value={comet.xCoordinate} required />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" placeholder="Coordonnée Y" onChange={handleChange} value={comet.yCoordinate} required />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" placeholder="Coordonnée Z" onChange={handleChange} value={comet.zCoordinate} required />

        <label htmlFor="nextAppearance">Prochaine Apparition</label>
        <input id="nextAppearance" name="nextAppearance" type="date" placeholder="Prochaine Apparition" onChange={handleChange} value={comet.nextAppearance} required />

        <label htmlFor="tailColor">Couleur de la Queue</label>
        <select id="tailColor" name="tailColor" onChange={handleChange} value={comet.tailColor}>
          <option value="orange">Orange</option>
          <option value="blue">Bleu</option>
        </select>

        <button type="submit">Ajouter Comète</button>
      </form>
    </div>
  );
};

export default AddComet;
