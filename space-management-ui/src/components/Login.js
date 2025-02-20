import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Login.css'; 

const Login = ({ setUsername, setUserId }) => {
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      navigate('/planets');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7134/api/auth/login', {
        username,
        passwordHash: password
      });

      // Stockez les données dans localStorage
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', response.data.userId); // Assurez-vous que userId est stocké
      setUsername(username);
      setUserId(response.data.userId); // Mettez à jour l'état avec l'ID utilisateur
      navigate('/planets');
    } catch (error) {
      console.error('Erreur de connexion', error);
      setError('Nom d’utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Connexion</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">Se connecter</button>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
