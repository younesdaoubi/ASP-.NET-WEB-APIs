import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Edit.css'; // Assurez-vous d'utiliser les styles CSS appropriés

const AddSatellite = () => {
  const [satellite, setSatellite] = useState({
    name: '',
    description: '',
    orbitType: '',
    launchDate: '',
    function: '',
    imageUrl: '',
    xCoordinate: 0,
    yCoordinate: 0,
    zCoordinate: 0,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSatellite(prevSatellite => ({
      ...prevSatellite,
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
      await axios.post('https://localhost:7162/api/satellites', satellite, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/satellites');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du satellite!', error.response ? error.response.data : error.message);
      setError('Erreur lors de l\'ajout du satellite.');
    }
  };

  return (
    <div className="container">
      <h1>Ajouter un Satellite</h1>
      {error && <p className="error">{error}</p>}
      <form className="add-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" value={satellite.name || ''} onChange={handleChange} placeholder="Nom" required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={satellite.description || ''} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" value={satellite.xCoordinate || 0} onChange={handleChange} placeholder="Coordonnée X" />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" value={satellite.yCoordinate || 0} onChange={handleChange} placeholder="Coordonnée Y" />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" value={satellite.zCoordinate || 0} onChange={handleChange} placeholder="Coordonnée Z" />

        <label htmlFor="launchDate">Date de lancement</label>
        <input id="launchDate" name="launchDate" type="date" value={satellite.launchDate || ''} onChange={handleChange} placeholder="Date de lancement" />
 
        <label htmlFor="orbitType">Type d'orbite</label>
        <input id="orbitType" name="orbitType" value={satellite.orbitType || ''} onChange={handleChange} placeholder="Type d'orbite" />

        <label htmlFor="function">Fonction</label>
        <input id="function" name="function" value={satellite.function || ''} onChange={handleChange} placeholder="Fonction" />

        <button type="submit">Ajouter Satellite</button>
      </form>
    </div>
  );
};

export default AddSatellite;
