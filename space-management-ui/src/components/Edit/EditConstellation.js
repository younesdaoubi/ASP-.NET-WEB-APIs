import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Edit.css'; 

const EditConstellation = () => {
  const { id } = useParams();
  const [constellation, setConstellation] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`https://localhost:7162/api/constellations/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => setConstellation(response.data))
      .catch(error => {
        console.error('Erreur de chargement!', error);
        setError('Erreur de chargement des données.');
      });
  }, [id, navigate]);

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
      await axios.put(`https://localhost:7162/api/constellations/${id}`, constellation, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/constellations');
    } catch (error) {
      console.error('Erreur de modification!', error.response ? error.response.data : error.message);
      setError('Erreur lors de la modification de la constellation.');
    }
  };

  if (!constellation) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h1>Modifier une Constellation</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" value={constellation.name || ''} onChange={handleChange} placeholder="Nom" required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={constellation.description || ''} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" value={constellation.xCoordinate || ''} onChange={handleChange} placeholder="Coordonnée X" />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" value={constellation.yCoordinate || ''} onChange={handleChange} placeholder="Coordonnée Y" />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" value={constellation.zCoordinate || ''} onChange={handleChange} placeholder="Coordonnée Z" />

        <label htmlFor="mainStars">Étoiles Principales</label>
        <input id="mainStars" name="mainStars" value={constellation.mainStars || ''} onChange={handleChange} placeholder="Étoiles Principales" />

        <label htmlFor="bestViewingMonths">Meilleurs Mois pour Observation</label>
        <input id="bestViewingMonths" name="bestViewingMonths" value={constellation.bestViewingMonths || ''} onChange={handleChange} placeholder="Meilleurs Mois pour Observation" />

        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default EditConstellation;
