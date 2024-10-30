import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Callback from './pages/Callback';
import AccountInfo from './pages/AccountInfo';
import './index.css'; 

const Main = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/AccountInfo" element={<AccountInfo />} />
    </Routes>
  </Router>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);