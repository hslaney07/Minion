import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TopArtists = () => {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term'); // Default time range
  const [amount, setAmount] = useState(10); // Default amount
  const token = localStorage.getItem('spotifyToken');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteArtists = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/artists?limit=${amount}&time_range=${timeRange}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setFavoriteArtists(data.items); // Update state with the fetched data
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFavoriteArtists();
  }, [timeRange, amount]); // Re-fetch when timeRange or amount changes

  return (
    <div className='container'>
          <header className="header">
          <Link to="/" className='header-title'>
            <h1 >Spotify App</h1>
          </Link>
              <button onClick={() => navigate('/')} className="home-button">
              Home
            </button>
          </header>
        <header>
          <h2>Your Top Artists</h2>
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
        {favoriteArtists.map((artist) => (
          <div key={artist.id} className="artist-card">
            <img
              src={artist.images[0]?.url} // Display the first image
              alt={artist.name}
              className="artist-image"
            />
            <h3>{artist.name}</h3>
            <p>Followers: {artist.followers.total.toLocaleString()}</p>
            <p>Popularity: {artist.popularity}</p>
            <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              View on Spotify
            </a>
          </div>
        ))}
        </div>
    </div>
  );
};

export default TopArtists;
