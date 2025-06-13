import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gesture_label: '',
  action: '',
  confidence: 0,
};

const musicControl = createSlice({
  name: 'musicControl',
  initialState,
  reducers: {
    setMusicControlSlice: (state, action) => {
        return { ...state, ...action.payload };
    }
  },
});

export const { setMusicControlSlice } = musicControl.actions;
export default musicControl.reducer;
