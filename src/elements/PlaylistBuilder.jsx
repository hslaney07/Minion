import "../css-files/sweet.css";
import { useState } from 'react';
import { AVAILABLE_GENRES } from '../data/genres';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showError, showSuccess, showPlaylistCreationDialog} from '../services/alertServices.jsx';
import { getPlaylistContent, searchForPlaylistItems, createPlaylist, addTracksToPlaylist} from '../helpers/SpotifyAPICalls.jsx';
import { updateInput, addSeed, removeSeed, setRecommendations, setPlaylistName, setPlaylistLimit} from '../store.jsx';

const PlaylistBuilder = () => {
  const navigate = useNavigate();

  const inputs = useSelector(state => state.inputs);
  const seeds = useSelector(state => state.seeds);
  const playlist = useSelector(state => state.playlist);
  const dispatch = useDispatch();
  const [availableGenres] = useState(AVAILABLE_GENRES);


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
    showPlaylistCreationDialog(playlist.name, (result) => {
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
      const trackUris = playlist.recommendations.map(track => track.uri);
      console.log(trackUris)
  
      await addTracksToPlaylist(playlistData.id, trackUris)
      
      showSuccess(`Playlist has been created!`)
    } catch (error) {
      showError(`Playlist was not created!`, `<a href="#">${error}</a>`)
    }
  };

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
  console.log(totalSubCategores)
  const numTracksEach = Math.ceil(limit / totalSubCategores);
  console.log(numTracksEach)

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

  const getTracksFromSimilarPlaylists = async (requestType) => {
    const playlist_items = await searchForPlaylistItems(requestType)
    
    var playlistTracks = await getTracksFromPlaylists(playlist_items)
    return playlistTracks;

  }

  const getTracksFromPlaylists = async (playlists) => {
    // RIGHT NOW JUST top 3 playlists
    playlists = playlists.filter(item => item).map(item => item).slice(0,3);

    var playlistIDs = playlists.map(item => item.id);

    const fetchPromises = playlistIDs.map(id => getPlaylistContent(id));
    
    try {
      const allContents = await Promise.all(fetchPromises);
      
      const uniqueContents = Array.from(
        new Map(allContents.flat().map(track => [track.id, track])).values()
      );
      
    
      return Object.values(uniqueContents);
    } catch (error) {
      showError(`Error fetching playlist contents`,  `<a href="#">${error}</a>`)
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
    <div className="container">
      <header className="header">
        <Link to="/Spotify" className="header-title">
          <h1>Spotify App</h1>
        </Link>
        <button onClick={() => navigate('/Spotify')} className="home-button">
          Home
        </button>
      </header>

      <div>
          <div className='playlist-header'>
            <h2>Build Your Recommended Playlist</h2>
        </div>
        <div className='playlist-params'>
            <label>Enter Songs:
            <input
              type="text"
              value={inputs.trackName}
              onChange={handleTrackChange}
              placeholder="Enter song name"
            />
            <button onClick={addTrack}>Add Song</button>
            <div className="song-list">
              {seeds.tracks.length > 0 && seeds.tracks.map((track, index) => (
                <div key={index} className="song-item">
                  <span>{track}</span>
                  <button onClick={() => removeTrack(index)}>Remove</button>
                </div>
              ))}
            </div>
            </label>
            <label>Enter Genres:
            <select
                value={inputs.genre}
                onChange={handleGenreChange}
                placeholder="Select genre"
              >
                <option value="">Select a genre</option>
                {availableGenres.map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <button onClick={addGenre}>Add Genre</button>
              <div className="song-list">
            {seeds.genres.length > 0 && seeds.genres.map((genre, index) => (
              <div key={index} className="song-item">
                <span>{genre}</span>
                <button onClick={() => removeGenre(index)}>Remove</button>
              </div>
            ))}
          </div>
            </label>
            <label>Enter Artists:
            <input
              type="text"
              value={inputs.artistName}
              onChange={handleArtistChange}
              placeholder="Enter artist name"
            />
            <button onClick={addArtist}>Add Artist</button>
            <div className="song-list">
              {seeds.artists.length > 0 && seeds.artists.map((artist, index) => (
                <div key={index} className="song-item">
                  <span>{artist}</span>
                  <button onClick={() => removeArtist(index)}>Remove</button>
                </div>
              ))}
            </div>
            </label>
          <label>
            Song Limit:
            <input
              type="number"
              step="1"
              min="1"
              max="100"
              value={playlist.limit}
              onChange={(e) => dispatch(setPlaylistLimit(e.target.value === '' ? '' : parseFloat(e.target.value)))}
            />
          </label>
          <label>
            Playlist Name:
            <input
              type="text"
              value={playlist.name}
              onChange={(e) => dispatch(setPlaylistName(e.target.value))}
            />
          </label>
        </div>
        </div>

        <button id="generate-playlist" onClick={getRecommendations}>
          Generate Playlist
        </button>

              
        {playlist.recommendations.length> 0 && (
          <>
          <div className="playlist-list">
            {playlist.recommendations.map((track) => (
              <div key={track.id} className="playlist-track-card">
                <div className='track-info'>
                <img
                  src={track.album.images[0].url} // Display the first image
                  alt={track.name}
                  className="playlist-album-image"
                />
              <div className="playlist-info">
                <h3>{track.name}</h3>
                <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
                <p>{track.album.name}</p>
              </div>
              <button
                onClick={() => removeTrackFromPlaylist(track.id)} // Pass track.id here
                className="remove-track-button"
                title="Remove this song from playlist"
              >
                X
              </button>
              </div>
          </div>
        ))}
      </div>
      <button id="create-playlist" className="create-playlist-button" onClick={handleCreatePlaylist}>
        Create Playlist
      </button>
      </>
    )}
  </div>
  );
};

export default PlaylistBuilder;
