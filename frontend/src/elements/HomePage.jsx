import '../css-files/App.css';
import { useEffect, useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import { showError } from '../services/alertServices';
import HomePageVisual from '../components/HomePageVisual';

const HomePage = () => {
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
          navigate('/'); 
        }
      } catch (error) {
        showError(`Error fetching data`, `<a href="#">${error}</a>`);
      }
    };

    fetchUserData();
  }, []);

if (userData === null) {
  return <div className="container">Loading...</div>;
}else{
  return (
    <HomePageVisual userData={userData} />
  );
}
};

export default HomePage;
