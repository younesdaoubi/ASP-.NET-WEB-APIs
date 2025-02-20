import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Import all components
import PlanetList from './components/List/PlanetList';
import AddPlanet from './components/Add/AddPlanet';
import EditPlanet from './components/Edit/EditPlanet';
import DetailsPlanete from './components/Details/DetailsPlanete';
import MoonList from './components/List/MoonList';
import AddMoon from './components/Add/AddMoon';
import EditMoon from './components/Edit/EditMoon';
import DetailsMoon from './components/Details/DetailsMoon';
import SatelliteList from './components/List/SatelliteList';
import AddSatellite from './components/Add/AddSatellite';
import EditSatellite from './components/Edit/EditSatellite';
import DetailsSatellite from './components/Details/DetailsSatellite';
import AlienList from './components/List/AlienList';
import AddAlien from './components/Add/AddAlien';
import EditAlien from './components/Edit/EditAlien';
import DetailsAlien from './components/Details/DetailsAlien';
import SpaceshipList from './components/List/SpaceshipList';
import AddSpaceship from './components/Add/AddSpaceship';
import EditSpaceship from './components/Edit/EditSpaceship';
import DetailsSpaceship from './components/Details/DetailsSpaceship';
import ConstellationList from './components/List/ConstellationList';
import AddConstellation from './components/Add/AddConstellation';
import EditConstellation from './components/Edit/EditConstellation';
import DetailsConstellation from './components/Details/DetailsConstellation';
import CometList from './components/List/CometList';
import AddComet from './components/Add/AddComet';
import EditComet from './components/Edit/EditComet';
import DetailsComet from './components/Details/DetailsComet';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';
import NotificationList from './components/NotificationList';
import AllPlanetsMap from './components/Map/AllPlanetsMap';
import AllMoonsMap from './components/Map/AllMoonsMap'; 
import AllAliensMap from './components/Map/AllAliensMap'; 
import AllSatellitesMap from './components/Map/AllSatellitesMap'; 
import AllCometsMap from './components/Map/AllCometsMap'; 
import AllSpaceshipsMap from './components/Map/AllSpaceshipsMap'; 
import AllConstellationsMap from './components/Map/AllConstellationsMap'; 
import AllCelestialObjectsMap from './components/Map/AllCelestialObjectsMap'; 

function App() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    if (storedUsername && storedUserId) {
      setUsername(storedUsername);
      setUserId(storedUserId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    setUsername('');
    setUserId(null);
  };

  return (
    <Router>
      <div className="App">
        <h1>Gestion des Corps Célestes</h1>
        {username && <p className="user-info">Bienvenue, {username}!</p>}
        {userId && <p className="user-info user-id">Id : {userId}</p>}
        <nav>
          <ul>
            {username ? (
              <>
                <li>
                  <Link to="/planets">Planètes</Link>
                  <ul>
                    <li><Link to="/planets">Visualiser la liste des planètes</Link></li>
                    <li><Link to="/planets/add">Créer une planète</Link></li>
                    <li><Link to="/all-planets-map">Visualiser toutes les planètes (3D)</Link></li>
                  </ul>
                </li>

                <li>
                  <Link to="/moons">Lunes</Link>
                  <ul>
                    <li><Link to="/moons">Visualiser la liste des lunes</Link></li>
                    <li><Link to="/moons/add">Créer une lune</Link></li>
                    <li><Link to="/all-moons-map">Visualiser toutes les lunes (3D)</Link></li>
                  </ul>
                </li>

                <li>
                  <Link to="/comets">Comètes</Link>
                  <ul>
                    <li><Link to="/comets">Visualiser la liste des comètes</Link></li>
                    <li><Link to="/comets/add">Créer une comète</Link></li>
                    <li><Link to="/all-comets-map">Visualiser toutes les comètes (3D)</Link></li>
                  </ul>
                </li>

                <li>
                  <Link to="/satellites">Satellites</Link>
                  <ul>
                    <li><Link to="/satellites">Visualiser la liste des satellites</Link></li>
                    <li><Link to="/satellites/add">Créer un satellite</Link></li>
                    <li><Link to="/all-satellites-map">Visualiser tous les satellites (3D)</Link></li>
                  </ul>
                </li>

                <li>
                  <Link to="/aliens">Aliens</Link>
                  <ul>
                    <li><Link to="/aliens">Visualiser la liste des aliens</Link></li>
                    <li><Link to="/aliens/add">Créer un alien</Link></li>
                    <li><Link to="/all-aliens-map">Visualiser tous les aliens (3D)</Link></li>
                  </ul>
                </li>

                <li>
                  <Link to="/spaceships">Spaceships</Link>
                  <ul>
                    <li><Link to="/spaceships">Visualiser la liste des vaisseaux</Link></li>
                    <li><Link to="/spaceships/add">Créer un vaisseau</Link></li>
                    <li><Link to="/all-spaceships-map">Visualiser tous les vaisseaux (3D)</Link></li>
                  </ul>
                </li>

                <li>
                  <Link to="/constellations">Constellations</Link>
                  <ul>
                    <li><Link to="/constellations">Visualiser la liste des constellations</Link></li>
                    <li><Link to="/constellations/add">Créer une constellation</Link></li>
                    <li><Link to="/all-constellations-map">Visualiser toutes les constellations (3D)</Link></li>
                  </ul>
                </li>

                {/* New "CARTE 3D" menu */}
                <li>
                  <Link to="/3d-map">CARTE 3D</Link>
                  <ul>
                    <li><Link to="/all-planets-map">Visualiser toutes les planètes</Link></li>
                    <li><Link to="/all-moons-map">Visualiser toutes les lunes</Link></li>
                    <li><Link to="/all-comets-map">Visualiser toutes les comètes</Link></li>
                    <li><Link to="/all-satellites-map">Visualiser tous les satellites</Link></li>
                    <li><Link to="/all-aliens-map">Visualiser tous les aliens</Link></li>
                    <li><Link to="/all-spaceships-map">Visualiser tous les vaisseaux</Link></li>
                    <li><Link to="/all-constellations-map">Visualiser toutes les constellations</Link></li>
                    <li><Link to="/all-celestial-objects-map">Visualiser tout l'espace</Link></li>
                  </ul>
                </li>

                <li><Link to="/notifications">Voir mes notifications</Link></li>
                <li><button onClick={handleLogout}>Se déconnecter</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Connexion</Link></li>
                <li><Link to="/register">Inscription</Link></li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={username ? <Navigate to="/planets" /> : <Login setUsername={setUsername} setUserId={setUserId} />} />
          <Route path="/planets" element={<PrivateRoute><PlanetList /></PrivateRoute>} />
          <Route path="/planets/add" element={<PrivateRoute><AddPlanet /></PrivateRoute>} />
          <Route path="/planets/edit/:id" element={<PrivateRoute><EditPlanet /></PrivateRoute>} />
          <Route path="/planets/details/:id" element={<PrivateRoute><DetailsPlanete /></PrivateRoute>} />
          <Route path="/all-planets-map" element={<PrivateRoute><AllPlanetsMap /></PrivateRoute>} />
          <Route path="/moons" element={<PrivateRoute><MoonList /></PrivateRoute>} />
          <Route path="/moons/add" element={<PrivateRoute><AddMoon /></PrivateRoute>} />
          <Route path="/moons/edit/:id" element={<PrivateRoute><EditMoon /></PrivateRoute>} />
          <Route path="/moons/details/:id" element={<PrivateRoute><DetailsMoon /></PrivateRoute>} />
          <Route path="/all-moons-map" element={<PrivateRoute><AllMoonsMap /></PrivateRoute>} />
          <Route path="/satellites" element={<PrivateRoute><SatelliteList /></PrivateRoute>} />
          <Route path="/satellites/add" element={<PrivateRoute><AddSatellite /></PrivateRoute>} />
          <Route path="/satellites/edit/:id" element={<PrivateRoute><EditSatellite /></PrivateRoute>} />
          <Route path="/satellites/details/:id" element={<PrivateRoute><DetailsSatellite /></PrivateRoute>} />
          <Route path="/all-satellites-map" element={<PrivateRoute><AllSatellitesMap /></PrivateRoute>} />
          <Route path="/aliens" element={<PrivateRoute><AlienList /></PrivateRoute>} />
          <Route path="/aliens/add" element={<PrivateRoute><AddAlien /></PrivateRoute>} />
          <Route path="/aliens/edit/:id" element={<PrivateRoute><EditAlien /></PrivateRoute>} />
          <Route path="/aliens/details/:id" element={<PrivateRoute><DetailsAlien /></PrivateRoute>} />
          <Route path="/all-aliens-map" element={<PrivateRoute><AllAliensMap /></PrivateRoute>} />
          <Route path="/spaceships" element={<PrivateRoute><SpaceshipList /></PrivateRoute>} />
          <Route path="/spaceships/add" element={<PrivateRoute><AddSpaceship /></PrivateRoute>} />
          <Route path="/spaceships/edit/:id" element={<PrivateRoute><EditSpaceship /></PrivateRoute>} />
          <Route path="/spaceships/details/:id" element={<PrivateRoute><DetailsSpaceship /></PrivateRoute>} />
          <Route path="/all-spaceships-map" element={<PrivateRoute><AllSpaceshipsMap /></PrivateRoute>} />
          <Route path="/constellations" element={<PrivateRoute><ConstellationList /></PrivateRoute>} />
          <Route path="/constellations/add" element={<PrivateRoute><AddConstellation /></PrivateRoute>} />
          <Route path="/constellations/edit/:id" element={<PrivateRoute><EditConstellation /></PrivateRoute>} />
          <Route path="/constellations/details/:id" element={<PrivateRoute><DetailsConstellation /></PrivateRoute>} />
          <Route path="/all-constellations-map" element={<PrivateRoute><AllConstellationsMap /></PrivateRoute>} />
          <Route path="/comets" element={<PrivateRoute><CometList /></PrivateRoute>} />
          <Route path="/comets/add" element={<PrivateRoute><AddComet /></PrivateRoute>} />
          <Route path="/comets/edit/:id" element={<PrivateRoute><EditComet /></PrivateRoute>} />
          <Route path="/comets/details/:id" element={<PrivateRoute><DetailsComet /></PrivateRoute>} />
          <Route path="/all-comets-map" element={<PrivateRoute><AllCometsMap /></PrivateRoute>} />
          <Route path="/login" element={<Login setUsername={setUsername} setUserId={setUserId} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />
          <Route path="/notifications" element={<PrivateRoute><NotificationList /></PrivateRoute>} />
          <Route path="/all-celestial-objects-map" element={<PrivateRoute><AllCelestialObjectsMap /></PrivateRoute>} />
          <Route path="/3d-map" element={<PrivateRoute>
            {/* Optionally add a placeholder or overview component here */}
            <div className="placeholder">Sélectionnez un type d'objet céleste pour visualiser en 3D.</div>
          </PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
