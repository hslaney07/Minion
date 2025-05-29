import { useEffect, useState } from 'react';  
import { showError } from '../services/alertServices';
import AccountVisual from '../components/AccountVisual';

const AccountInfo = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/me`, {
          credentials: 'include' 
        })
          .then(res => res.json())
          .then(data => setUserData(data));
         
      } catch (error) {
        showError(`Error fetching data`, `<a href="#">${error}</a>`)
      }
    };

    fetchUserData();
  }, []);


  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        window.location.href = import.meta.env.VITE_HOMEPAGE_URL;
      } else {
        showError(`Logout failed`);
      }
    } catch (err) {
      showError(`Logout Error`, `<a href="#">${err}</a>`)
    }
  };

  return (
   <AccountVisual userData={userData} handleLogout={handleLogout} />
  );
};

export default AccountInfo;

