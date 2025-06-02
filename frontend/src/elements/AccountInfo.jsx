import { useEffect } from 'react'; 
import { clearUserData, setUserData } from '../stores/userSlice';
import {getUserData, logoutUser} from '../helpers/SpotifyAPICalls'; 
import AccountVisual from '../components/AccountVisual';
import { useSelector, useDispatch } from 'react-redux';

const AccountInfo = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  const HandleLogout = async() => {
    dispatch(clearUserData())
    await logoutUser();
  }

  useEffect(() => {
    console.log(userData)
    if (!userData.display_name) {
      const fetchAndStoreUser = async () => {
        const userDataFromSpotify = await getUserData();
        if (userDataFromSpotify) {
          dispatch(setUserData(userDataFromSpotify));
        }
      };
      fetchAndStoreUser();
    }
  }, [dispatch, userData]);

  return (
   <AccountVisual HandleLogout={HandleLogout}/>
  );
};

export default AccountInfo;

