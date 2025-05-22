import { useEffect, useState } from 'react';  
import { useNavigate, Link } from 'react-router-dom';

const AccountInfo = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('spotifyToken');
  const navigate = useNavigate();

  useEffect (() => {
    const fetchUserData  = async() => {
        
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setUserData(data); // Update state with the fetched data
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('spotifyToken');
    window.open('https://accounts.spotify.com/logout', '_blank');
    window.location.href = import.meta.env.VITE_HOMEPAGE_URL;
  };

    return (
      <div className="container">
          <header className="header">
            <Link to="/" className='header-title'>
              <h1 >{import.meta.env.VITE_APP_NAME}</h1>
            </Link>
              <button onClick={() => navigate('/')} className="home-button">
              Home
            </button>
            <div className="header-right">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </header>
        < >
        {error && <p >{error}</p>}
          {userData ? (
            <div className='user-data' >
              <h2>User Info</h2>
              <p><strong>Name:</strong> {userData.display_name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Country:</strong> {userData.country}</p>
              <p><strong>Followers:</strong> {userData.followers.total}</p>
              <p><a href={userData.external_urls.spotify}><strong>{userData.display_name} Account</strong></a></p>
              {userData.images && userData.images[0] && (
                <img
                  src={userData.images[0].url}
                  alt="User Profile"
                  className="profile-image"
                />
              )}
            </div>
          ) : (
            <p>User Data Not Available</p>
          )}
        </>
      </div>
    );
};

export default AccountInfo;

