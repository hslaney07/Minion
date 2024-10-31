import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term'); // Default time range
  const [amount, setAmount] = useState(10); // Default amount
  const token = localStorage.getItem('spotifyToken');

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks?limit=${amount}&time_range=${timeRange}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTopTracks(data.items);
        } else {
          console.error('Failed to fetch top tracks');
        }
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      }
    };

    fetchTopTracks();
  }, [timeRange, amount]); // Re-fetch when timeRange or amount changes

  return (
    <div className="container">
    
          <header className="header">
          <Link to="/" className='header-title'>
            <h1 >Spotify App</h1>
          </Link>
              <button onClick={() => navigate('/')} className="home-button">
              Home
            </button>
          </header>
        {/* Other components or content */}
      <div className='container'>
      <header className="fav-songs-header">
        <h2>Your Top Tracks</h2>
      </header>
      <div className="filters">
        <label htmlFor="time-range">Time Range:</label>
        <select
          id="time-range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="short_term">Short Term</option>
          <option value="medium_term">Medium Term</option>
          <option value="long_term">Long Term</option>
        </select>

        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          min="1"
          max="50"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="artists-list">
        {topTracks.map((track) => (
          <div key={track.id} className="artist-card">
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="artist-image"
            />
            <h3>{track.name}</h3>
            <p>Artist: {track.artists.map((artist) => artist.name).join(', ')}</p>
            <p>Album: {track.album.name}</p>
            <p>Popularity: {track.popularity}</p>
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              Listen on Spotify
            </a>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default TopTracks;
