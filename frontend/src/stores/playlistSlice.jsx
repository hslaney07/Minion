import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inputs: { artistName: '', genre: '', trackName: '' },
  seeds: { artists: [], genres: [], tracks: [] },
  playlist: { limit: 30, recommendations: [] }
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    updateInput: (state, action) => {
      state.inputs[action.payload.field] = action.payload.value;
    },
    addSeed: (state, action) => {
      state.seeds[action.payload.field].push(action.payload.value);
      state.inputs[action.payload.field] = '';
    },
    removeSeed: (state, action) => {
      state.seeds[action.payload.field].splice(action.payload.index, 1);
    },
    setRecommendations: (state, action) => {
      state.playlist.recommendations = action.payload;
    },
    setPlaylistLimit: (state, action) => {
      state.playlist.limit = action.payload;
    }
  }
});

export const { updateInput, addSeed, removeSeed, setRecommendations, setPlaylistLimit } = playlistSlice.actions;
export default playlistSlice.reducer ;