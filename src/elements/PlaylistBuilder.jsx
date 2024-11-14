import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PlaylistBuilder = () => {
  const token = localStorage.getItem('spotifyToken');
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState(null);
  
  const [playlistName, setPlaylistName] = useState('My Recommended Playlist');

  const [artistNames, setArtistNames] = useState([]);
  const [artistName, setArtistName] = useState('');

  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState('');

  const [trackNames, setTrackNames] = useState([]);
  const [trackName, setTrackName] = useState('');
  
  const [danceability, setDanceability] = useState('');
  const [energy, setEnergy] = useState('');
  const [liveness, setLiveness] = useState('');
  const [loudness, setLoudness] = useState('');
  const [popularity, setPopularity] = useState('');
  const [songLimit, setSongLimit] = useState(30);
  const [acousticness, setAcousticness] = useState('');
  const [instrumentalness, setInstrumentalness] = useState('');
  const [speechiness, setSpeechiness] = useState('');
  const [valence, setValence] = useState('');
  const [tempo, setTempo] = useState('');
  const [key, setKey] = useState('');

  const getID = async (name, type = 'artist') => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=${type}&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch artist');
      }

      const data = await response.json();
      console.log(data)
      if (type === 'artist') {
        const artist = data.artists.items[0];
        return artist ? artist.id : null;
      } else {
        const track = data.tracks.items[0];
        return track ? track.id : null;
      }
    } catch (error) {
      console.error('Error fetching artist ID:', error);
      return null;
    }
  };

  const createPlaylist = async () => {
    if (!recommendations || recommendations.length === 0) {
      console.log('No recommendations to add to playlist');
      return;
    }
  
    try {
      // get the user's Spotify ID
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user information');
      }
  
      const userData = await userResponse.json();
      const userId = userData.id;
  
      // create a new playlist
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playlistName,
            description: 'Generated with Spotify App',
            public: false,
          }),
        }
      );
  
      if (!playlistResponse.ok) {
        throw new Error('Failed to create playlist');
      }
  
      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;
  
      // add tracks to the new playlist
      const trackUris = recommendations.map((track) => track.uri);
  
      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: trackUris,
          }),
        }
      );
  
      if (!addTracksResponse.ok) {
        throw new Error('Failed to add tracks to playlist');
      }
  
      console.log('Playlist created successfully!');
      alert('Playlist created successfully!');
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Failed to create playlist');
    }
  };
  

  const getRecommendations = async () => {
    try {
      const params = new URLSearchParams();

      if (!(artistNames.length > 0) && ! (genres.length > 0) && !(trackNames.length > 0)){
        alert('Need to provide at least one seed (artist, genre, or track)');
        return;
      }

      if (artistNames.length > 0) {
        const artistIds = await Promise.all(
          artistNames.map(name => getID(name, 'artist'))
        );
        params.append('seed_artists', artistIds.filter(Boolean).join(','));
      }

      if (trackNames.length > 0) {
        const trackIds = await Promise.all(
          trackNames.map(name => getID(name, 'track'))
        );
        params.append('seed_tracks', trackIds.filter(Boolean).join(','));
      }

      if (genres.length > 0){
        params.append('seed_genres', genres.filter(Boolean).join(','));
      }

      if (danceability !== '') params.append('target_danceability', danceability);
      if (energy !== '') params.append('target_energy', energy);
      if (liveness !== '') params.append('target_liveness', liveness);
      if (loudness !== '') params.append('target_loudness', loudness);
      if (popularity !== '') params.append('target_popularity', popularity);
      if (acousticness !== '') params.append('target_acousticness', acousticness);
      if (instrumentalness !== '') params.append('target_instrumentalness', instrumentalness);
      if (speechiness !== '') params.append('target_speechiness', speechiness);
      if (valence !== '') params.append('target_valence', valence);
      if (tempo !== '') params.append('target_tempo', tempo);
      if (key !== '') params.append('target_key', key);

      params.append('limit', songLimit);
      
      const queryString = params.toString();
      console.log(queryString)

      const url = `https://api.spotify.com/v1/recommendations?${queryString}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.tracks);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleArtistChange = (e) => {
    setArtistName(e.target.value);
  };
  
  const addArtist = () => {
    if (artistNames.length >= 5) {
      alert('You can only add up to 5 artists.');
      return;
    }
    if (artistName.trim()) {
      setArtistNames([...artistNames, artistName]); 
      setArtistName(''); 
    } else {
      alert('Please enter a valid genre name');
    }
  };
  
  const removeArtist = (index) => {
    const updatedArtists = artistNames.filter((_, i) => i !== index);
    setArtistNames(updatedArtists); 
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };
  
  const addGenre = () => {
    if (genres.length >= 5) {
      alert('You can only add up to 5 genres.');
      return;
    }
    if (genre.trim()) {
      setGenres([...genres, genre]); 
      setGenre(''); 
    } else {
      alert('Please enter a valid genre name');
    }
  };
  
  const removeGenre = (index) => {
    const updatedGenres = genres.filter((_, i) => i !== index);
    setGenres(updatedGenres); 
  };
  

  const handleTrackChange = (e) => {
    setTrackName(e.target.value);
  };

  const addTrack = () => {
    if (trackNames.length >= 5) {
      alert('You can only add up to 5 tracks.');
      return; 
    }
    if (trackName.trim()) {
      setTrackNames([...trackNames, trackName]); 
      setTrackName(''); 
    } else {
      alert('Please enter a valid song name');
    }
  };

  const removeTrack = (index) => {
    const updatedTracks = trackNames.filter((_, i) => i !== index); 
    setTrackNames(updatedTracks); 
  };

  const removeTrackFromPlaylist = (index) => {
    setRecommendations(prevRecommendations => 
      prevRecommendations.filter((_, i) => i !== index)
    );
  };

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
        <h2 className='user-data'>Build Your Recommended Playlist</h2>
        <div className='playlist-params'>
            <label>Enter Songs:
            <input
              type="text"
              value={trackName}
              onChange={handleTrackChange}
              placeholder="Enter song name"
            />
            <button onClick={addTrack}>Add Song</button>
            <div className="song-list">
              {trackNames.length > 0 && trackNames.map((track, index) => (
                <div key={index} className="song-item">
                  <span>{track}</span>
                  <button onClick={() => removeTrack(index)}>Remove</button>
                </div>
              ))}
            </div>
            </label>
            <label>Enter Genres:
            <input
              type="text"
              value={genre}
              onChange={handleGenreChange}
              placeholder="Enter genre name"
            />
            <button onClick={addGenre}>Add Genre</button>
            <div className="song-list">
              {genres.length > 0 && genres.map((genre, index) => (
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
              value={artistName}
              onChange={handleArtistChange}
              placeholder="Enter artist name"
            />
            <button onClick={addArtist}>Add Artist</button>
            <div className="song-list">
              {artistNames.length > 0 && artistNames.map((artist, index) => (
                <div key={index} className="song-item">
                  <span>{artist}</span>
                  <button onClick={() => removeArtist(index)}>Remove</button>
                </div>
              ))}
            </div>
            </label>
          <label>
            Danceability (0-1):
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={danceability}
              onChange={(e) => setDanceability(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Energy (0-1):
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={energy}
              onChange={(e) => setEnergy(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Liveness (0-1):
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={liveness}
              onChange={(e) => setLiveness(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Loudness (0-1):
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={loudness}
              onChange={(e) => setLoudness(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Acousticness (0-1):
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={acousticness}
              onChange={(e) => setAcousticness(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Energy (0-1):
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={energy}
              onChange={(e) => setEnergy(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Instrumentalness (0-1):
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={instrumentalness}
              onChange={(e) => setInstrumentalness(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Speechiness (0-1):
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={speechiness}
              onChange={(e) => setSpeechiness(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Valence (0-1):
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="0.5"
              value={valence}
              onChange={(e) => setValence(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            <a href="https://en.wikipedia.org/wiki/Pitch_class#Other_ways_to_label_pitch_classes" target="_blank" rel="noopener noreferrer">
            Key (-1-11):
            </a>
            <input
              type="number"
              step="1"
              min="-1"
              max="11"
              placeholder="2"
              value={key}
              onChange={(e) => setKey(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Tempo (50-200):
            <input
              type="number"
              step="1"
              min="50"
              max="200"
              placeholder="100"
              value={tempo}
              onChange={(e) => setTempo(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Popularity (0-100):
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              placeholder="80"
              value={popularity}
              onChange={(e) => setPopularity(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>
          <label>
            Song Limit:
            <input
              type="number"
              step="1"
              min="1"
              max="100"
              value={songLimit}
              onChange={(e) => setSongLimit(e.target.value === '' ? '' : parseFloat(e.target.value))}
              
            />
          </label>
          <label>
            Playlist Name:
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </label>
        </div>
        </div>

        <button id="generate-playlist" onClick={getRecommendations}>
          Generate Playlist
        </button>

    
        {recommendations && (
          <div className="playlist-list">
          {recommendations.map((track, index) => (
            <div key={index} className="playlist-track-card">
              <img
                src={track.album.images[0].url} // Display the first image
                alt={track.name}
                className="playlist-album-image"
              />
              <div className='playlist-info'>
              <h3>{track.name}</h3>
              <p>{track.artists.map(artist => artist.name).join(', ')}</p>
              <p>{track.album.name}</p>
              </div>
              <button onClick={() => removeTrackFromPlaylist(index)} className="remove-track-button" title="Remove this song from playlist">
                X
              </button>
            </div>
          ))}
          <button id="create-playlist" onClick={createPlaylist}>
          Create Playlist
        </button>
          </div>
          
        )}
    </div>
  );
};

export default PlaylistBuilder;
