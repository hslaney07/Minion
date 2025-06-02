import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { NoDataAvailable } from './GeneralComponents';

function Header({HandleLogout}) {
  const navigate = useNavigate();
  return (
    <header className="header">
      <Link to="/Home" className="header-title">
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
      </Link>
      <button onClick={() => navigate('/Home')} className="home-button">
        Home
      </button>
      <button onClick={HandleLogout} className="logout-button">
        Logout
      </button>
    </header>
  );
}

function UserInfo({ }) {
  const userData = useSelector(state => state.user);

  if (!userData.display_name) return (<NoDataAvailable message="User Data Not Available." />);

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
        <img src={images[0].url} alt="User Profile" />
      )}
    </div>
  );
}

export default function AccountVisual({ HandleLogout }) {
  return (
    <>
      <Header HandleLogout={HandleLogout} />
      <UserInfo />
    </>
  );
}
