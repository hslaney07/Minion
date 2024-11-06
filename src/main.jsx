import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Callback from './pages/Callback';
import AccountInfo from './pages/AccountInfo';
import TopArtists from './elements/TopArtists';
import './index.css';
import TopTracks from './elements/TopTracks';

const Main = () => (
  <Router>
    <Routes >
      <Route path="/Spotify/" element={<App />} />
      <Route path="/Spotify/callback" element={<Callback />} />
      <Route path="/Spotify/AccountInfo" element={<AccountInfo />} />
      <Route path="/Spotify/FavoriteArtists" element={<TopArtists />} />
      <Route path="/Spotify/FavoriteTracks" element={<TopTracks />} />
    </Routes>
  </Router>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
