import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <Link to="/Home" className="header-title">
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
      </Link>
      <button onClick={() => navigate('/Home')} className="home-button">
        Home
      </button>
    </header>
  );
}

