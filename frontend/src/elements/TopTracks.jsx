import { useEffect, useState } from 'react';
import { showError } from '../services/alertServices';
import TopTracksVisual from '../components/TopTracksVisual';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term'); 
  const [amount, setAmount] = useState(10); 


  useEffect(() => {
    const fetchTopTracks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-top-tracks`, {
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
        showError('Failed to fetch top tracks')
      }

      const data = await response.json();
      setTopTracks(data.items)
    } catch (error) {
        console.error('Error fetching top tracks:', error);
      }
    };
    fetchTopTracks();
  }, [timeRange, amount]); 

  return (
    <TopTracksVisual
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      amount={amount}
      setAmount={setAmount}
      topTracks={topTracks}
    />
  );
};

export default TopTracks;
