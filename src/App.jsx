import './css-files/App.css';
import React, { useEffect, useState, useMemo } from 'react';  
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [userData, setUserData] = useState(null);

  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = 'https://stirring-kangaroo-2cf80d.netlify.app/';
  const SCOPES = 'user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private';
  const AUTH_URL = useMemo(() => {
    return `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
  }, [CLIENT_ID, SCOPES]);

  const token = localStorage.getItem('spotifyToken');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the URL contains an access token
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        localStorage.setItem('spotifyToken', accessToken);
        // Redirect to the main app without the token in the URL
        window.location.replace('https://stirring-kangaroo-2cf80d.netlify.app/') 
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
      <>
        <header className="header">
          <h1>Spotify App</h1>
          <div className="header-right">
            {userData.images && userData.images[0] && (
              <img
                src={userData.images[0].url}
                alt="User Profile"
                className="account-icon"
              />
            )}
            <button onClick={() => navigate('/AccountInfo')} className="top-right-button">
              Account Info
            </button>
          </div>
        </header>
        <div className="container">
          <button className="artist-page" onClick={() => navigate('/FavoriteArtists')}>
            Top Artists Page
          </button>
          <button className="track-page" onClick={() => navigate('/FavoriteTracks')}>
            Top Tracks Page
          </button>
          <button className="artist-page" onClick={() => navigate('/PlaylistBuilder')}>
            Playlist Builder
          </button>
          <button className="track-page" onClick={() => navigate('/MusicPlaybackControl')}>
            Music Control
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Spotify App</h1>
        <div className='header-right'>
        <button onClick={() => window.location.href = AUTH_URL} className="top-right-button">
          Login with Spotify
        </button>
        </div>
      </header>
    </div>
  );
};

export default App;
