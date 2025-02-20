import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setUsername }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    setUsername(''); // Met à jour l'état du nom d'utilisateur dans le composant App
    navigate('/login');
  }, [navigate, setUsername]);

  return null;
};

export default Logout;
