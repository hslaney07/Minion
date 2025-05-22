import { useEffect, useState } from 'react';  
import { useNavigate, Link } from 'react-router-dom';
import { showError } from '../services/alertServices';

const AccountInfo = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/me`, {
          credentials: 'include' // Send cookies!
        })
          .then(res => res.json())
          .then(data => setUserData(data));
         
      } catch (error) {
        showError(`Error fetching data`, `<a href="#">${error}</a>`)
      }
    };

    fetchUserData();
  }, []);


  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        // Optionally clear local state here if needed
        window.location.href = import.meta.env.VITE_HOMEPAGE_URL;
      } else {
        showError(`Logout failed`);
      }
    } catch (err) {
      showError(`Logout Error`, `<a href="#">${error}</a>`)
    }
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

