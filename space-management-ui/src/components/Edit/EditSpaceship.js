import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Edit.css';  
const EditSpaceship = () => {
  const { id } = useParams();
  const [spaceship, setSpaceship] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaceship = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/spaceships/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSpaceship(response.data);
      } catch (error) {
        console.error('Erreur de chargement!', error);
        setError('Erreur de chargement des données.');
      }
    };

    fetchSpaceship();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpaceship(prevSpaceship => ({
      ...prevSpaceship,
      [name]: value
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
      await axios.put(`https://localhost:7162/api/spaceships/${id}`, spaceship, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/spaceships');
    } catch (error) {
      console.error('Erreur de modification!', error);
      setError('Erreur lors de la modification du vaisseau spatial.');
    }
  };

  if (!spaceship) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h1>Modifier un Vaisseau Spatial</h1>
      {error && <p className="error">{error}</p>}
      <form className="edit-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" value={spaceship.name || ''} onChange={handleChange} placeholder="Nom" required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={spaceship.description || ''} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" value={spaceship.xCoordinate || ''} onChange={handleChange} placeholder="Coordonnée X" />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" value={spaceship.yCoordinate || ''} onChange={handleChange} placeholder="Coordonnée Y" />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" value={spaceship.zCoordinate || ''} onChange={handleChange} placeholder="Coordonnée Z" />

        <label htmlFor="launchDate">Date de lancement</label>
        <input id="launchDate" name="launchDate" type="date" value={spaceship.launchDate ? new Date(spaceship.launchDate).toISOString().split('T')[0] : ''} onChange={handleChange} />

        <label htmlFor="returnDate">Date de retour</label>
        <input id="returnDate" name="returnDate" type="date" value={spaceship.returnDate ? new Date(spaceship.returnDate).toISOString().split('T')[0] : ''} onChange={handleChange} />

        <label htmlFor="mission">Mission</label>
        <input id="mission" name="mission" value={spaceship.mission || ''} onChange={handleChange} placeholder="Mission" required />

        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default EditSpaceship;
