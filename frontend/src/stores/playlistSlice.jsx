import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inputs: { artistName: '', genre: '', trackName: '' },
  seeds: { artists: [], genres: [], tracks: [] },
  playlist: { limit: 30, recommendations: [], recommendationsRequested: false },
  inspiringPlaylists: []
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
    },
    recommendationsRequested: (state, action) => {
      state.playlist.recommendationsRequested = action.payload
    },
    addInspiringPlaylists: (state, action) => {
      const newPlaylists = action.payload;
      const existingIds = new Set(state.inspiringPlaylists.map(p => p.id));
      const uniqueNew = newPlaylists.filter(p => !existingIds.has(p.id));

      state.inspiringPlaylists = [...state.inspiringPlaylists, ...uniqueNew];
    },
    clearInspiringPlaylists: (state) => {
      state.inspiringPlaylists = [];
    }
  }
});

export const { updateInput, addSeed, removeSeed, setRecommendations, setPlaylistLimit, recommendationsRequested, clearInspiringPlaylists, addInspiringPlaylists} = playlistSlice.actions;
export default playlistSlice.reducer ;