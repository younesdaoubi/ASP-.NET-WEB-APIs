import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Edit.css'; // Assurez-vous d'utiliser les styles CSS appropriés

const AddMoon = () => {
  const [moon, setMoon] = useState({
    name: '',
    description: '',
    xCoordinate: 0,
    yCoordinate: 0,
    zCoordinate: 0,
    planetId: '',
    orbitalPeriod: 0,
    distanceFromPlanet: 0,
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [planets, setPlanets] = useState([]);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMoon(prevMoon => ({
      ...prevMoon,
      [name]: type === 'checkbox' ? checked : (name.includes('Coordinate') || name === 'orbitalPeriod' || name === 'distanceFromPlanet') ? parseFloat(value) : value
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
      await axios.post('https://localhost:7162/api/moons', moon, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/moons');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la lune!', error.response ? error.response.data : error.message);
      setError('Erreur lors de l\'ajout de la lune.');
    }
  };

  return (
    <div className="container">
      <h1>Ajouter une Lune</h1>
      {error && <p className="error">{error}</p>}
      <form className="add-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" value={moon.name || ''} onChange={handleChange} placeholder="Nom" required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={moon.description || ''} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" value={moon.xCoordinate || 0} onChange={handleChange} placeholder="Coordonnée X" />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" value={moon.yCoordinate || 0} onChange={handleChange} placeholder="Coordonnée Y" />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" value={moon.zCoordinate || 0} onChange={handleChange} placeholder="Coordonnée Z" />

        <label htmlFor="planetId">ID de la Planète</label>
        <select id="planetId" name="planetId" value={moon.planetId || ''} onChange={handleChange} required>
          <option value="">Sélectionner une planète</option>
          {planets.map(planet => (
            <option key={planet.id} value={planet.id}>
              {planet.name} (ID: {planet.id})
            </option>
          ))}
        </select>

        <label htmlFor="orbitalPeriod">Période Orbitale</label>
        <input id="orbitalPeriod" name="orbitalPeriod" type="number" value={moon.orbitalPeriod || 0} onChange={handleChange} placeholder="Période Orbitale (jours)" />

        <label htmlFor="distanceFromPlanet">Distance de la Planète</label>
        <input id="distanceFromPlanet" name="distanceFromPlanet" type="number" value={moon.distanceFromPlanet || 0} onChange={handleChange} placeholder="Distance de la Planète (km)" />
 
        <button type="submit">Ajouter Lune</button>
      </form>
    </div>
  );
};

export default AddMoon;
