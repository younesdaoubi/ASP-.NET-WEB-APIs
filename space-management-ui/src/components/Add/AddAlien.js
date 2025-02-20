import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Edit.css'; // Assurez-vous d'utiliser les styles CSS appropriés

const AddAlien = () => {
  const [alien, setAlien] = useState({
    name: '',
    description: '',
    xCoordinate: 0,
    yCoordinate: 0,
    zCoordinate: 0,
    originPlanet: '',
    isFriendly: false,
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAlien({
      ...alien,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", alien);
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('https://localhost:7162/api/aliens', alien, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Response from server:", response);
      navigate('/aliens');
    } catch (error) {
      console.error('Erreur de création!', error.response ? error.response.data : error.message);
      setError('Erreur de création! Veuillez vérifier les données et réessayer.');
    }
  };

  return (
    <div className="container">
      <h1>Ajouter un Alien</h1>
      {error && <p className="error">{error}</p>}
      <form className="add-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" placeholder="Nom" onChange={handleChange} value={alien.name} required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" placeholder="Description" onChange={handleChange} value={alien.description} required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" placeholder="Coordonnée X" onChange={handleChange} value={alien.xCoordinate} />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" placeholder="Coordonnée Y" onChange={handleChange} value={alien.yCoordinate} />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" placeholder="Coordonnée Z" onChange={handleChange} value={alien.zCoordinate} />

        <label htmlFor="originPlanet">Planète d'origine</label>
        <input id="originPlanet" name="originPlanet" placeholder="Planète d'origine" onChange={handleChange} value={alien.originPlanet} />

        <label htmlFor="isFriendly">
          Amical:
          <input id="isFriendly" name="isFriendly" type="checkbox" onChange={handleChange} checked={alien.isFriendly} />
        </label>

      
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddAlien;
