import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Register.css'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('https://localhost:7134/api/auth/register', {
        username,
        passwordHash: password  
      });
      navigate('/login'); // Redirection après inscription réussie
    } catch (error) {
      console.error('Erreur d\'inscription', error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Inscription</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <button onClick={handleRegister} className="register-button">S'inscrire</button>
      </div>
    </div>
  );
};

export default Register;
