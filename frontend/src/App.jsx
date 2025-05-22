import './css-files/App.css';
import React, { useEffect, useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import { showError } from './services/alertServices';

const App = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/me`, {
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        showError(`Error fetching data`, `<a href="#">${error}</a>`)
      }
    };

    fetchUserData();
  }, []);


  if (userData) {
    return (
      <>
        <header className="header">
          <h1>{import.meta.env.VITE_APP_NAME}</h1>
          <div className="header-right">
            {userData.images?.[0] && (
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
  } else {
    return (
      <div className="container">
        <header className="header">
          <h1>{import.meta.env.VITE_APP_NAME}</h1>
        </header>
        <div className="container">
          <button className="artist-page" onClick={window.location.href = `${import.meta.env.VITE_BACKEND_URL}/login`}>
            Login with Spotify
          </button>
        </div>
      </div>
    );
  }
};

export default App;
