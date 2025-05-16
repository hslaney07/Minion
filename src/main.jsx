import App from './App';
import store from './store';
import './css-files/index.css';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import TopTracks from './elements/TopTracks';
import TopArtists from './elements/TopArtists';
import AccountInfo from './elements/AccountInfo';
import PlaylistBuilder from './elements/PlaylistBuilder';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Main = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/Spotify/" element={<App />} />
        <Route path="/Spotify/AccountInfo" element={<AccountInfo />} />
        <Route path="/Spotify/FavoriteArtists" element={<TopArtists />} />
        <Route path="/Spotify/FavoriteTracks" element={<TopTracks />} />
        <Route path="/Spotify/PlayListBuilder" element={<PlaylistBuilder />} />
      </Routes>
    </Router>
  </Provider>
);

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);