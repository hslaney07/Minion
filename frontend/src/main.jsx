import App from './App';
import store from './store';
import './css-files/index.css';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import HomePage from './elements/HomePage';
import TopTracks from './elements/TopTracks';
import TopArtists from './elements/TopArtists';
import AccountInfo from './elements/AccountInfo';
import PlaylistBuilder from './elements/PlaylistBuilder';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Main = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/AccountInfo" element={<AccountInfo />} />
        <Route path="/FavoriteArtists" element={<TopArtists />} />
        <Route path="/FavoriteTracks" element={<TopTracks />} />
        <Route path="/PlayListBuilder" element={<PlaylistBuilder />} />
      </Routes>
    </Router>
  </Provider>
);

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);