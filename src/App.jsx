import './App.css';
import React, { useEffect, useState, useMemo } from 'react';  
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  console.log('here');
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const SCOPES = 'user-read-private user-read-email user-top-read';
  const token = localStorage.getItem('spotifyToken');

  const REDIRECT_URI = 'https://hslaney07.github.io/Spotify/#/callback/';

  const AUTH_URL = useMemo(() => {
    return `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
  }, [CLIENT_ID, SCOPES]);

  const [userData, setUserData] = useState(null);
  console.log('token is')
  console.log(token);

  
  useEffect(() => {
    // Check if the URL contains an access token
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        localStorage.setItem('spotifyToken', accessToken);
        // Redirect to the main app without the token in the URL
        window.location.replace(REDIRECT_URI); // This will reload the page
      }
    }
  }, []);
  

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data, token may be expired');
          localStorage.removeItem('spotifyToken');  // Clear token if invalid
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, [token]);

  if (token && userData) {
    return (
      <div className="container">
        <header className="header">
          <h1>Spotify App</h1>
          <div className="account-info">
            {userData.images && userData.images[0] && (
              <img
                src={userData.images[0].url}
                alt="User Profile"
                className="account-icon"
              />
            )}
            <button onClick={() => navigate('/Spotify/AccountInfo')} className="auth-button">
              Account Info
            </button>
          </div>
        </header>
        <div className="container">
          <button className="artist-page" onClick={() => navigate('/Spotify/FavoriteArtists')}>
            Top Artists Page
          </button>
          <button className="track-page" onClick={() => navigate('/Spotify/FavoriteTracks')}>
            Top Tracks Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Spotify App</h1>
        <button onClick={() => window.location.href = AUTH_URL} className="auth-button">
          Login with Spotify
        </button>
      </header>
    </div>
  );
};

export default App;
