import '../css-files/App.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Header({ }) {
  const userData = useSelector(state => state.user);
  const navigate = useNavigate();
  return (
    <header className="header">
      <h1>{import.meta.env.VITE_APP_NAME}</h1>
      <div className="account-information-header">
        {userData.images?.[0] && (
          <img
            src={userData.images[0].url}
            alt="User Profile"
            className="account-icon"
          />
        )}
        <button onClick={() => navigate('/AccountInfo')} className="account-information-button">
          Account Info
        </button>
      </div>
    </header>
  );
}

function PageOptions({}){
  const navigate = useNavigate();
  return(
    <div className="container">
      <button className="generic-button-home-page" onClick={() => navigate('/FavoriteArtists')}>
        Top Artists Page
      </button>
      <button className="generic-button-home-page" onClick={() => navigate('/FavoriteTracks')}>
        Top Tracks Page
      </button>
      <button className="generic-button-home-page" onClick={() => navigate('/PlaylistBuilder')}>
        Playlist Builder
      </button>
      <button className="generic-button-home-page" onClick={() => navigate('/MusicPlaybackControl')}>
        Music Control
      </button>
    </div>);
}

export default function HomePageVisual() {
  return (
      <>
        <Header />
        <PageOptions />
      </>
  )
}