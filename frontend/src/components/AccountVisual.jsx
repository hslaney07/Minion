import { Link, useNavigate } from 'react-router-dom';

function Header({ onLogout }) {
  const navigate = useNavigate();
  return (
    <header className="header">
      <Link to="/Home" className="header-title">
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
      </Link>
      <button onClick={() => navigate('/Home')} className="home-button">
        Home
      </button>
      <div className="header-right">
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
}

function UserInfo({ userData }) {
  if (!userData) return <p>User Data Not Available</p>;

  const { display_name, email, country, followers, external_urls, images } = userData;
  
  return (
    <div className="user-data">
      <h2>User Info</h2>
      <p><strong>Name:</strong> {display_name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Country:</strong> {country}</p>
      <p><strong>Followers:</strong> {followers?.total}</p>
      <p>
        <a href={external_urls?.spotify}>
          <strong>{display_name} Account</strong>
        </a>
      </p>
      {images?.[0] && (
        <img src={images[0].url} alt="User Profile" className="profile-image" />
      )}
    </div>
  );
}

export default function AccountVisual({ userData, handleLogout }) {
  return (
    <div className="container">
      <Header onLogout={handleLogout} />
      <UserInfo userData={userData} />
    </div>
  );
}
