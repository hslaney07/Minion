import { configureStore } from '@reduxjs/toolkit';
import playlistReducer from './stores/playlistSlice';
import userReducer from './stores/userSlice';
import musicControlReducer from './stores/musicPlaybackSlice';

export default configureStore({
  reducer: {
    playlist: playlistReducer,
    user: userReducer,
    musicControl: musicControlReducer
  },
});
