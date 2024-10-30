import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
    useEffect(() => {
        const hash = window.location.hash;
        let token = '';

        console.log(hash);
    
        if (hash) {
          const queryString = hash.substring(1);

          // Create a URLSearchParams object
          const params = new URLSearchParams(queryString);

          // Get the access token
          token = params.get('access_token');
    
          // Log the access token and other info as needed
          console.log('Access Token:', token);
          localStorage.setItem('spotifyToken', token);
          console.log('Access Token:', token);
    
          // Optional: Log expiration time
          const expiresIn = hash.split('&')
            .find(elem => elem.startsWith('expires_in'))
            .split('=')[1];
          console.log('Expires In:', expiresIn);
    
          // Redirect to the main page without the hash
          window.location.replace('http://localhost:5173');
        }
      }, []);

  return <div>Loading...</div>;
};

export default Callback;
