import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = '';
    console.log(hash)
    localStorage.setItem('spotifyToken', hash);

    if (hash) {
      const queryString = hash.substring(10); // Remove '#'
      const params = new URLSearchParams(queryString);
      token = params.get('access_token');

      if (token) {
        localStorage.setItem('spotifyToken', token);
        //navigate('/'); // Redirect to the main page or ho me page after saving the token
      } else {
        console.error('Access token not found in the URL');
      }
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
