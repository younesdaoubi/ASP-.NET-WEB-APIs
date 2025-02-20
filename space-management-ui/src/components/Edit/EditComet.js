import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Edit.css';  

const EditComet = () => {
  const { id } = useParams();
  const [comet, setComet] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`https://localhost:7162/api/comets/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => setComet(response.data))
    .catch(error => {
      console.error('Erreur de chargement!', error);
      setError('Erreur de chargement des données.');
    });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComet(prevComet => ({
      ...prevComet,
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
      await axios.put(`https://localhost:7162/api/comets/${id}`, comet, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/comets');
    } catch (error) {
      console.error('Erreur de modification!', error.response ? error.response.data : error.message);
      setError('Erreur lors de la modification de la comète.');
    }
  };

  if (!comet) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h1>Modifier une Comète</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" value={comet.name || ''} onChange={handleChange} placeholder="Nom" required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={comet.description || ''} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" value={comet.xCoordinate || ''} type="number" onChange={handleChange} placeholder="Coordonnée X" required />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" value={comet.yCoordinate || ''} type="number" onChange={handleChange} placeholder="Coordonnée Y" required />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" value={comet.zCoordinate || ''} type="number" onChange={handleChange} placeholder="Coordonnée Z" required />

        <label htmlFor="nextAppearance">Prochaine Apparition</label>
        <input id="nextAppearance" name="nextAppearance" type="date" value={comet.nextAppearance ? comet.nextAppearance.split('T')[0] : ''} onChange={handleChange} placeholder="Prochaine Apparition" required />

        <label htmlFor="tailColor">Couleur de la Queue</label>
        <select id="tailColor" name="tailColor" onChange={handleChange} value={comet.tailColor || 'orange'}>
          <option value="orange">Orange</option>
          <option value="blue">Bleu</option>
        </select>

        <button type="submit">Modifier Comète</button>
      </form>
    </div>
  );
};

export default EditComet;
