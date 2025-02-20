import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Edit.css'; // Assurez-vous d'utiliser les styles CSS appropriés

const textureOptions = [
  { value: 'terre', label: 'Terre' },
  { value: 'mars', label: 'Mars' },
  { value: 'neptune', label: 'Neptune' },
  { value: 'jupiter', label: 'Jupiter' },
  { value: 'venus', label: 'Vénus' },
  { value: 'uranus', label: 'Uranus' },
  { value: 'mercure', label: 'Mercure' }
];

const AddPlanet = () => {
  const [planet, setPlanet] = useState({
    name: '',
    description: '',
    xCoordinate: 0,
    yCoordinate: 0,
    zCoordinate: 0,
    hasRings: false,
    supportsLife: false,
    diameter: 0,
    mass: 0,
    distanceFromSun: 0,
    surfaceTexture: '', 
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlanet(prevPlanet => ({
      ...prevPlanet,
      [name]: type === 'checkbox' ? checked : (name.includes('Coordinate') || name === 'diameter' || name === 'mass' || name === 'distanceFromSun') ? parseFloat(value) : value
    }));
  };

  const handleTextureChange = (e) => {
    const value = e.target.value;
    setPlanet(prevPlanet => ({
      ...prevPlanet,
      surfaceTexture: value
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
      const planetData = {
        ...planet,
        imageUrl: planet.imageUrl.trim() === '' ? 'https://example.com/default-image.jpg' : planet.imageUrl // Valeur par défaut si imageUrl est vide
      };

      await axios.post('https://localhost:7162/api/planets', planetData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/planets');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la planète!', error.response ? error.response.data : error.message);
      setError('Erreur lors de l\'ajout de la planète.');
    }
  };

  return (
    <div className="container">
      <h1>Ajouter une Planète</h1>
      {error && <p className="error">{error}</p>}
      <form className="add-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" value={planet.name} onChange={handleChange} placeholder="Nom" required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={planet.description} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" value={planet.xCoordinate} onChange={handleChange} placeholder="Coordonnée X" />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" value={planet.yCoordinate} onChange={handleChange} placeholder="Coordonnée Y" />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" value={planet.zCoordinate} onChange={handleChange} placeholder="Coordonnée Z" />

        <label htmlFor="diameter">Diamètre</label>
        <input id="diameter" name="diameter" type="number" value={planet.diameter} onChange={handleChange} placeholder="Diamètre (km)" />

        <label htmlFor="mass">Masse</label>
        <input id="mass" name="mass" type="number" value={planet.mass} onChange={handleChange} placeholder="Masse (kg)" />

        <label htmlFor="distanceFromSun">Distance du Soleil</label>
        <input id="distanceFromSun" name="distanceFromSun" type="number" value={planet.distanceFromSun} onChange={handleChange} placeholder="Distance du Soleil (km)" />

        <label htmlFor="hasRings">Possède des anneaux</label>
        <input id="hasRings" name="hasRings" type="checkbox" checked={planet.hasRings} onChange={handleChange} />

        <label htmlFor="supportsLife">Supporte la vie</label>
        <input id="supportsLife" name="supportsLife" type="checkbox" checked={planet.supportsLife} onChange={handleChange} />

        <label htmlFor="surfaceTexture">Texture de Surface</label>
        <select id="surfaceTexture" name="surfaceTexture" value={planet.surfaceTexture} onChange={handleTextureChange}>
          {textureOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button type="submit">Ajouter Planète</button>
      </form>
    </div>
  );
};

export default AddPlanet;
