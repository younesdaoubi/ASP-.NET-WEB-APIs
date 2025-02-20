import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/list.css'; 

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // État pour l'ordre de tri
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('jwtToken');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7134/api/UserNotifications/notifications/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Notifications reçues:', response.data); // Vérifiez les données reçues
        setNotifications(response.data);
      } catch (error) {
        console.error('Erreur de chargement des notifications!', error);
        setError('Erreur lors de la récupération des notifications.');
      }
    };

    fetchNotifications();
  }, [navigate]);

  const handleSort = () => {
    const sortedNotifications = [...notifications].sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.notificationDate) - new Date(b.notificationDate);
      } else {
        return new Date(b.notificationDate) - new Date(a.notificationDate);
      }
    });
    setNotifications(sortedNotifications);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Inverse l'ordre de tri
  };

  return (
    <div className="container">
      <h1>Vos Notifications</h1>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button onClick={handleSort} className="add-link">
          Trier par date ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
        </button>
      </div>
      <ul className="item-list">
        {notifications.length === 0 ? (
          <p>Aucune notification.</p>
        ) : (
          notifications.map(notification => (
            <li key={notification.id} className="item-list-item">
              <div className="notif-detail">
                <p><strong>Message:</strong> {notification.message}</p>
                <p><strong>Date:</strong> {new Date(notification.notificationDate).toLocaleString()}</p>
               </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationList;
