import{ useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showError } from '../services/alertServices';

const TopArtists = () => {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term'); 
  const [amount, setAmount] = useState(10); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteArtists = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-top-artists`, {
        method: 'POST',
        credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({ 
          amount: amount,
          timeRange: timeRange
          }),
      });
  
      if (!response.ok) {
        showError(`Failed to fetch top artists`)
      }
      
      const data = await response.json();
      setFavoriteArtists(data.items); 

    } catch (error) {
      showError(`Error fetching favorite artists `, `<a href="#">${error}</a>`);
    }
  };

    fetchFavoriteArtists();
  }, [timeRange, amount]); // Re-fetch when timeRange or amount changes

  return (
    <div className='container'>
          <header className="header">
          <Link to="/" className='header-title'>
            <h1 >{import.meta.env.VITE_APP_NAME}</h1>
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
              src={artist.images[0]?.url} 
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
