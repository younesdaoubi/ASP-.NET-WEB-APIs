import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/Edit.css';  

const textureOptions = [
  { value: 'mars', label: 'Mars' },
  { value: 'terre', label: 'Terre' },
  { value: 'neptune', label: 'Neptune' },
  { value: 'jupiter', label: 'Jupiter' },
  { value: 'venus', label: 'Vénus' },
  { value: 'uranus', label: 'Uranus' },
  { value: 'mercure', label: 'Mercure' }
];

const EditPlanet = () => {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanet = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7162/api/planets/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPlanet(response.data);
      } catch (error) {
        console.error('Erreur de chargement!', error);
        setError('Erreur de chargement des données.');
      }
    };

    fetchPlanet();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlanet(prevPlanet => ({
      ...prevPlanet,
      [name]: type === 'checkbox' ? checked : value
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
        imageUrl: planet.imageUrl.trim() === '' ? 'https://example.com/default-image.jpg' : planet.imageUrl
      };

      await axios.put(`https://localhost:7162/api/planets/${id}`, planetData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/planets');
    } catch (error) {
      console.error('Erreur de modification!', error.response ? error.response.data : error.message);
      setError('Erreur lors de la modification de la planète.');
    }
  };

  if (!planet) return <div>Chargement...</div>;

  return (
    <div className="container">
      <h1>Modifier une Planète</h1>
      {error && <p className="error">{error}</p>}
      <form className="edit-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" value={planet.name || ''} onChange={handleChange} placeholder="Nom" required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={planet.description || ''} onChange={handleChange} placeholder="Description" required />

        <label htmlFor="xCoordinate">Coordonnée X</label>
        <input id="xCoordinate" name="xCoordinate" type="number" value={planet.xCoordinate || 0} onChange={handleChange} placeholder="Coordonnée X" />

        <label htmlFor="yCoordinate">Coordonnée Y</label>
        <input id="yCoordinate" name="yCoordinate" type="number" value={planet.yCoordinate || 0} onChange={handleChange} placeholder="Coordonnée Y" />

        <label htmlFor="zCoordinate">Coordonnée Z</label>
        <input id="zCoordinate" name="zCoordinate" type="number" value={planet.zCoordinate || 0} onChange={handleChange} placeholder="Coordonnée Z" />

        <label htmlFor="diameter">Diamètre</label>
        <input id="diameter" name="diameter" type="number" value={planet.diameter || 0} onChange={handleChange} placeholder="Diamètre" />

        <label htmlFor="mass">Masse</label>
        <input id="mass" name="mass" type="number" value={planet.mass || 0} onChange={handleChange} placeholder="Masse" />

        <label htmlFor="distanceFromSun">Distance du Soleil</label>
        <input id="distanceFromSun" name="distanceFromSun" type="number" value={planet.distanceFromSun || 0} onChange={handleChange} placeholder="Distance du Soleil" />

        <label htmlFor="hasRings">Possède des anneaux</label>
        <input id="hasRings" name="hasRings" type="checkbox" checked={planet.hasRings || false} onChange={handleChange} />

        <label htmlFor="supportsLife">Supporte la vie</label>
        <input id="supportsLife" name="supportsLife" type="checkbox" checked={planet.supportsLife || false} onChange={handleChange} />

        <label htmlFor="surfaceTexture">Texture de Surface</label>
        <select id="surfaceTexture" name="surfaceTexture" value={planet.surfaceTexture || ''} onChange={handleTextureChange}>
          {textureOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button type="submit">Modifier Planète</button>
      </form>
    </div>
  );
};

export default EditPlanet;
