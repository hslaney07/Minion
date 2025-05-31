import { useEffect } from 'react'; 
import { setUserData } from '../stores/userSlice';
import {getUserData} from '../helpers/SpotifyAPICalls'; 
import AccountVisual from '../components/AccountVisual';
import { useSelector, useDispatch } from 'react-redux';

const AccountInfo = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  useEffect(() => {
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
   <AccountVisual />
  );
};

export default AccountInfo;

