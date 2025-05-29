import { useState } from 'react';
import { Header } from './GeneralComponents';
import { setPlaylistLimit} from '../store.jsx';
import { AVAILABLE_GENRES } from '../data/genres';
import { useSelector, useDispatch } from 'react-redux';

function PlaylistHeader({inputs, seeds, playlist, dispatch, availableGenres, addTrack, removeTrack, handleTrackChange, addGenre, removeGenre, handleGenreChange, addArtist, removeArtist, handleArtistChange, getRecommendations}){
  return(
    <>
      <div>
        <div className='playlist-header'>
          <h2>Build Your Recommended Playlist</h2>
        </div>
        <div className='playlist-params'>
          <EnterSongs inputs={inputs} seeds={seeds} addTrack={addTrack} removeTrack={removeTrack} handleTrackChange={handleTrackChange}></EnterSongs>
          <EnterGenres inputs={inputs} seeds={seeds} availableGenres={availableGenres} addGenre={addGenre} removeGenre={removeGenre} handleGenreChange={handleGenreChange}></EnterGenres>
          <EnterArtists inputs={inputs} seeds={seeds} addArtist={addArtist} removeArtist={removeArtist} handleArtistChange={handleArtistChange}></EnterArtists>
          <EnterSongLimit playlist={playlist} dispatch={dispatch}></EnterSongLimit>
        </div>
      </div>
      <button id="generate-playlist" onClick={getRecommendations}>
        Generate Playlist
      </button>
    </>
  )
}

function EnterSongs({inputs, seeds, addTrack, removeTrack, handleTrackChange}){
  return (
    <>
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
    </>
  )

}

function EnterSongLimit({playlist, dispatch}){
  return(
  <>
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
  </>
  );
}

function EnterArtists({inputs, seeds, addArtist, removeArtist, handleArtistChange}){
  return (
    <>
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
    </>
  );
}

function EnterGenres({inputs, seeds, availableGenres, addGenre, removeGenre, handleGenreChange}){
  return (
    <>
      <label>Enter Genres:
        <input
          list="genres"
          value={inputs.genre}
          onChange={handleGenreChange}
          placeholder="Select or type a genre"
        />
        <datalist id="genres">
          {availableGenres.map((genre, idx) => (
            <option key={idx} value={genre} />
          ))}
        </datalist>
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
    </>
  );
}

function TrackResults({playlist, handleCreatePlaylist, removeTrackFromPlaylist}){
    return(
    <>
    {playlist.recommendations.length> 0 && (
        <>
        <div className="playlist-list">
          {playlist.recommendations.map((track) => (
            <div key={track.id} className="playlist-track-card">
              <div className='track-info'>
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="playlist-album-image"
                />
                <div className="playlist-info">
                  <h3>{track.name}</h3>
                  <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
                  <p>{track.album.name}</p>
                </div>
                <button
                  onClick={() => removeTrackFromPlaylist(track.id)} 
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
  </>
  );
}


export default function PlaylistBuilderVisual({
    addTrack, removeTrack, handleTrackChange,
    addGenre, removeGenre, handleGenreChange,
    addArtist, removeArtist, handleArtistChange, 
    removeTrackFromPlaylist,
    handleCreatePlaylist,
    getRecommendations
}) {
  const inputs = useSelector(state => state.inputs);
  const seeds = useSelector(state => state.seeds);
  const playlist = useSelector(state => state.playlist);
  const dispatch = useDispatch();
  const [availableGenres] = useState(AVAILABLE_GENRES);
  
  return (
    <div className="container">
      <Header />
      <PlaylistHeader 
      inputs={inputs} seeds={seeds} playlist={playlist} dispatch={dispatch} availableGenres={availableGenres}
      addTrack={addTrack} removeTrack={removeTrack} handleTrackChange={handleTrackChange} 
      addGenre={addGenre} removeGenre={removeGenre} handleGenreChange={handleGenreChange} 
      addArtist={addArtist} removeArtist={removeArtist} handleArtistChange={handleArtistChange} 
      getRecommendations={getRecommendations}></PlaylistHeader>
      <TrackResults 
      playlist={playlist}
      handleCreatePlaylist={handleCreatePlaylist} removeTrackFromPlaylist={removeTrackFromPlaylist}></TrackResults>
    </div>
  );
}