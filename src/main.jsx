import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AccountInfo from './pages/AccountInfo';
import TopArtists from './elements/TopArtists';
import './css-files/index.css';
import TopTracks from './elements/TopTracks';
import PlaylistBuilder from './elements/PlaylistBuilder';
import Modal from 'react-modal';

const Main = () => (
  <Router>
    <Routes >
      <Route path="/Spotify/" element={<App />} />
      <Route path="/Spotify/AccountInfo" element={<AccountInfo />} />
      <Route path="/Spotify/FavoriteArtists" element={<TopArtists />} />
      <Route path="/Spotify/FavoriteTracks" element={<TopTracks />} />
      <Route path="/Spotify/PlayListBuilder" element={<PlaylistBuilder />} />
    </Routes>
  </Router>
);

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
