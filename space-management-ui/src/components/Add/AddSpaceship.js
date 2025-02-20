import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Edit.css'; // Assurez-vous d'utiliser les styles CSS appropriés

const AddSpaceship = () => {
  const [spaceship, setSpaceship] = useState({
    name: '',
    description: '',
    mission: '',
    launchDate: '',
    returnDate: '',
    xCoordinate: 0,
    yCoordinate: 0,
    zCoordinate: 0,
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpaceship({
      ...spaceship,
      [name]: value
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
      await axios.post('https://localhost:7162/api/spaceships', spaceship, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/spaceships');
    } catch (error) {
      console.error('Erreur de création!', error.response ? error.response.data : error.message);
      setError('Erreur de création! Veuillez vérifier les données et réessayer.');
    }
  };

  return (
    <div className="container">
      <h1>Ajouter un Vaisseau Spatial</h1>
      {error && <p className="error">{error}</p>}
      <form className="edit-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" placeholder="Nom" onChange={handleChange} value={spaceship.name} required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={spaceship.description || ''} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" value={spaceship.xCoordinate || 0} onChange={handleChange} placeholder="Coordonnée X" />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" value={spaceship.yCoordinate || 0} onChange={handleChange} placeholder="Coordonnée Y" />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" value={spaceship.zCoordinate || 0} onChange={handleChange} placeholder="Coordonnée Z" />

        <label htmlFor="launchDate">Date de lancement</label>
        <input id="launchDate" name="launchDate" type="date" value={spaceship.launchDate ? spaceship.launchDate.split('T')[0] : ''} onChange={handleChange} />

        <label htmlFor="returnDate">Date de retour</label>
        <input id="returnDate" name="returnDate" type="date" value={spaceship.returnDate ? spaceship.returnDate.split('T')[0] : ''} onChange={handleChange} />

        <label htmlFor="mission">Mission</label>
        <input id="mission" name="mission" value={spaceship.mission || ''} onChange={handleChange} placeholder="Mission" required />

        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddSpaceship;
