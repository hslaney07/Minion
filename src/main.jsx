import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Callback from './pages/Callback';
import AccountInfo from './pages/AccountInfo';
import TopArtists from './elements/TopArtists';
import './index.css'; 
import TopTracks from './elements/TopTracks';

const Main = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/AccountInfo" element={<AccountInfo />} />
      <Route path="/FavoriteArtists" element={<TopArtists />} />
      <Route path="/FavoriteTracks" element={<TopTracks />} />
    </Routes>
  </Router>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);