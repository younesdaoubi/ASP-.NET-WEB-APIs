import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Edit.css';  

const EditSatellite = () => {
  const { id } = useParams();
  const [satellite, setSatellite] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSatellite = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/satellites/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSatellite(response.data);
      } catch (error) {
        console.error('Erreur de chargement du satellite!', error);
        setError('Erreur lors de la récupération du satellite.');
      }
    };

    fetchSatellite();
  }, [id, navigate]);

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
      await axios.put(`https://localhost:7162/api/satellites/${id}`, satellite, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/satellites');
    } catch (error) {
      console.error('Erreur lors de la modification du satellite!', error.response ? error.response.data : error.message);
      setError('Erreur lors de la modification du satellite.');
    }
  };

  if (!satellite) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h1>Modifier un Satellite</h1>
      {error && <p className="error">{error}</p>}
      <form className="edit-form" onSubmit={handleSubmit}>
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
        <input id="launchDate" name="launchDate" type="date" value={satellite.launchDate ? satellite.launchDate.split('T')[0] : ''} onChange={handleChange} placeholder="Date de lancement" />

        <label htmlFor="orbitType">Type d'orbite</label>
        <input id="orbitType" name="orbitType" value={satellite.orbitType || ''} onChange={handleChange} placeholder="Type d'orbite" />

        <label htmlFor="function">Fonction</label>
        
        <input id="function" name="function" value={satellite.function || ''} onChange={handleChange} placeholder="Fonction" />


        <button type="submit">Modifier Satellite</button>
      </form>
    </div>
  );
};

export default EditSatellite;
