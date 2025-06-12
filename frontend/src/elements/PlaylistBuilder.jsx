import "../css-files/sweet.css";
import { useSelector, useDispatch } from 'react-redux';
import PlaylistBuilderVisual from "../components/PlaylistBuilderVisual.jsx";
import { updateInput, addSeed, removeSeed, setRecommendations, recommendationsRequested, addInspiringPlaylists, clearInspiringPlaylists, addOtherPlaylistsOfInterest, clearOtherPlaylistsOfInterest } from "../stores/playlistSlice.jsx";
import { showError, showSuccess, showPlaylistCreationDialog} from '../services/alertServices.jsx';
import { getPlaylistContent, searchForPlaylistItems, createPlaylist, addTracksToPlaylist} from '../helpers/SpotifyAPICalls.jsx';

const PlaylistBuilder = () => {
  const inputs = useSelector(state => state.playlist.inputs);
  const seeds = useSelector(state => state.playlist.seeds);
  const playlist = useSelector(state => state.playlist.playlist);
 
  const dispatch = useDispatch();

  const handleArtistChange = (e) => {
    dispatch(updateInput({ field: 'artistName', value: e.target.value }));
  };

  const handleGenreChange = (e) => {
    dispatch(updateInput({ field: 'genre', value: e.target.value }));
  };

  const handleTrackChange = (e) => {
    dispatch(updateInput({ field: 'trackName', value: e.target.value }));
  };

  const removeArtist = (index) => {
    dispatch(removeSeed({ field: 'artists', value: index}));
  };

  const removeGenre = (index) => {
    dispatch(removeSeed({ field: 'genres', value: index}));
  };

  const removeTrack = (index) => {
    dispatch(removeSeed({ field: 'tracks', value: index}));
  };

  const addArtist = () => {
    if (seeds.artists.length >= 5) {
      showError('You can only add up to 5 artists.')
      return;
    }
    if (inputs.artistName.trim()) {
      dispatch(addSeed({ field: 'artists', value: inputs.artistName }));
      dispatch(updateInput({ field: 'artistName', value: '' }));
    } else {
      showError('Please enter a valid artist name');
    }
  };

  const addGenre = () => {
    if (seeds.genres.length >= 5) {
      showError('You can only add up to 5 genres.')
      return;
    }
    if (inputs.genre.trim()) {
      dispatch(addSeed({ field: 'genres', value: inputs.genre }));
      dispatch(updateInput({ field: 'genre', value: '' }));
    } else {
      showError('Please enter a valid genre name');
    }
  };

  const addTrack = async () => {
    if (seeds.tracks.length >= 5) {
      showError('You can only add up to 5 tracks.')
      return; 
    }

    if (inputs.trackName.trim()) {
      dispatch(addSeed({ field: 'tracks', value: inputs.trackName }));
      dispatch(updateInput({ field: 'trackName', value: '' }));
    } else {
      showError('Please enter a valid song name');
    }
  };

  const handleCreatePlaylist = () => {
    showPlaylistCreationDialog((result) => {
      const { name, description, isPublic } = result;
      createSpotifyPlaylist(name, description, isPublic);
    });
  };

  const removeTrackFromPlaylist = (trackId) => {
    dispatch(setRecommendations(
      playlist.recommendations.filter(track => track.id !== trackId)
    ));
  };

  const getRecommendations = async () => {
    try {
      if (!hasValidSeeds(seeds)) {
        showError('Need to provide at least one seed (artist, genre, or track)');
        return;
      }
      dispatch(clearInspiringPlaylists())
      dispatch(clearOtherPlaylistsOfInterest())
      dispatch(recommendationsRequested(true))

      const tracksCollected = await collectTracksFromSeeds(seeds);
      const recommendations = processTracks(tracksCollected, playlist.limit);
      
      dispatch(setRecommendations(recommendations));
    } catch (error) {
      showError('Error fetching recommendations',`<a href="#">${error}</a>`);
    }
  };

  const createSpotifyPlaylist = async (name, description, isPublic) => {
    if (!playlist.recommendations || playlist.recommendations.length === 0) {
      showError('No recommendations to add to playlist')
      return;
    }
  
    try {
      const playlistData = await createPlaylist(name, description, isPublic)
      if (playlistData == null){
        return;
      }
      const trackUris = playlist.recommendations.map(track => track.uri);
  
      const response = await addTracksToPlaylist(playlistData.id, trackUris)
      if (response && response.ok) {
        showSuccess('Playlist has been created!');
      }

    } catch (error) {
      showError(`Playlist was not created!`, `<a href="#">${error}</a>`)
    }
  };

  const clearRecommendations = () => {
    dispatch(clearInspiringPlaylists())
    dispatch(clearOtherPlaylistsOfInterest())
    dispatch(recommendationsRequested(false))
    dispatch(setRecommendations([]))
  }

  // Helper functions
  const hasValidSeeds = (seeds) => {
    return seeds.artists.length > 0 || seeds.genres.length > 0 || seeds.tracks.length > 0;
  };

  const collectTracksFromSeeds = async (seeds) => {
    const tracksCollected = {};

    if (seeds.artists.length > 0) {
      tracksCollected.Artists = await getTracksForSeedType(seeds.artists, 'artist');
    }

    if (seeds.tracks.length > 0) {
      tracksCollected.Tracks = await getTracksForSeedType(seeds.tracks, 'track');
    }

    if (seeds.genres.length > 0) {
      tracksCollected.Genres = await getTracksForSeedType(seeds.genres, 'tag');
    }

    return tracksCollected;
  };

  const getTracksForSeedType = async (items, searchType) => {
    const tracks = {};
    for (const item of items) {
      tracks[item] = await getTracksFromSimilarPlaylists(`${searchType}:${encodeURIComponent(item)}`);
    }
    return tracks;
  };

  const processTracks = (tracksCollected, limit) => {
    const allSongs = new Map();
    
    const totalSubCategores = seeds.artists.length + seeds.genres.length + seeds.tracks.length
    const numTracksEach = Math.ceil(limit / totalSubCategores);

    Object.values(tracksCollected).forEach(category => {
      Object.values(category).forEach(tracks => {
        const newTracks = shuffleArray([...tracks])
          .filter(song => !allSongs.has(song.id))
          .slice(0, numTracksEach);
          
        newTracks.forEach(song => allSongs.set(song.id, song));
      });
    });

    return Array.from(allSongs.values());
  };

  const processInspiringPlaylists = (playlists) => {
    const defaultImageUrl = "/default-playlist-image.jpg";

    const processedPlaylists = playlists.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      externalUrl: item.external_urls?.spotify ?? '',
      image: item.images?.[0]?.url || defaultImageUrl,
    }));

    const playlistsToUse = processedPlaylists.filter(item => item).map(item => item).slice(0,3);
    const remainingPlaylists = processedPlaylists.filter(item => item).map(item => item).slice(3);

    dispatch(addInspiringPlaylists(playlistsToUse));
    dispatch(addOtherPlaylistsOfInterest(remainingPlaylists));
  };

  const getTracksFromSimilarPlaylists = async (requestType) => {
    const playlist_items = await searchForPlaylistItems(requestType)
    if (playlist_items == null){
      return [];
    }
  
    var playlistTracks = await getTracksFromPlaylists(playlist_items)
    return playlistTracks;
  }

  const getTracksFromPlaylists = async (playlists) => {
    // RIGHT NOW JUST top 3 playlists
    const cleanedPlaylists = playlists.filter(Boolean);
    console.log(cleanedPlaylists)
    processInspiringPlaylists(cleanedPlaylists);

    const playlistsToUse = cleanedPlaylists.filter(item => item).map(item => item).slice(0,3);

    var playlistIDs = playlistsToUse.map(item => item.id);

    const fetchPromises = playlistIDs.map(id => getPlaylistContent(id));
    
    try {
      const allContents = await Promise.all(fetchPromises);
      const validContents = allContents.filter(content => Array.isArray(content));

      const uniqueContents = Array.from(
        new Map(validContents.flat().map(track => [track.id, track])).values()
      );

      return uniqueContents;
    } catch (error) {
      showError(`Error fetching playlist contents`, `<a href="#">${error}</a>`);
      return [];
    }
  }

  function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  return (
    <PlaylistBuilderVisual 
    addTrack={addTrack}  removeTrack={removeTrack} handleTrackChange={handleTrackChange} 
    addGenre={addGenre} removeGenre={removeGenre} handleGenreChange={handleGenreChange} 
    addArtist={addArtist} removeArtist={removeArtist} handleArtistChange={handleArtistChange} 
    removeTrackFromPlaylist={removeTrackFromPlaylist} handleCreatePlaylist={handleCreatePlaylist} 
    getRecommendations={getRecommendations} clearRecommendations={clearRecommendations}>
    </PlaylistBuilderVisual>
  );
};

export default PlaylistBuilder;
