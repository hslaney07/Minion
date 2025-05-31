import { configureStore } from '@reduxjs/toolkit';
import playlistReducer from './stores/playlistSlice';
import userReducer from './stores/userSlice';

export default configureStore({
  reducer: {
    playlist: playlistReducer,
    user: userReducer,
  },
});
