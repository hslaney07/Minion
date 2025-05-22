import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const MusicPlaybackControl = () => {

   return (
      <div className="container">
          <header className="header">
            <Link to="/" className='header-title'>
              <h1 >{import.meta.env.VITE_APP_NAME}</h1>
            </Link>
              <button onClick={() => navigate('/')} className="home-button">
              Home
            </button>
          </header>
        < >
        </>
      </div>
    );
 
};

export default MusicPlaybackControl;
