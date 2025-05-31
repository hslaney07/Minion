// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  display_name: '',
  email: '',
  country: '',
  followers: { total: 0 },
  external_urls: {},
  images: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUserData: () => initialState,
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
