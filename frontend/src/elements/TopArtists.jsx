import{ useEffect, useState } from 'react';
import { showError } from '../services/alertServices';
import TopArtistsVisual from '../components/TopArtistsVisual';

const TopArtists = () => {
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term'); 
  const [amount, setAmount] = useState(10); 

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
  }, [timeRange, amount]);

  return (
    <TopArtistsVisual
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      amount={amount}
      setAmount={setAmount}
      favoriteArtists={favoriteArtists}
    />
  );
};

export default TopArtists;
