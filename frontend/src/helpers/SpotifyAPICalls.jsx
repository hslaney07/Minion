import { showError } from "../services/alertServices";

export const getPlaylistContent = async(playlistId) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-playlist-content`, {
      method: 'POST',
      credentials: 'include',
       headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify({ playlistId }),
    });

    if (!response.ok) {
      showError(`Failed to fetch playlist ${playlistId}: ${response.status}`)
      return null;
    }

    const data = await response.json();
    const tracks = data.items
        .filter(item => item && item.track) 
        .map(item => item.track);

    return tracks;
}


export const createPlaylist = async(playlistName, description, isPublic) => {
  try{
    const playlistResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-playlist`, {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playlistName,
        description: description ?? `Generated with ${import.meta.env.VITE_APP_NAME}`,
        isPublic: isPublic,
      }),
    });

    if (!playlistResponse.ok) {
        showError('Failed to create playlist');
        return null;
    }

    const playlistData = await playlistResponse.json();
    return playlistData;

  } catch(exception){
    showError(`Error creating playlist`, `<a href="#">${error}</a>`);
    return null;
  }
}

export const addTracksToPlaylist = async (playlistId, trackUris) => {

  const addTracksResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/add-tracks-to-playlist`, {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId: playlistId,
        uris: trackUris
      }),
    });

    if (!addTracksResponse.ok) {
      showError('Failed to add tracks to playlist');
      return null;
    }
    
    return addTracksResponse;
}

export const searchForPlaylistItems = async (requestType) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/search-for-playlist-items`, {
      method: 'POST',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: requestType,
      }),
    });

    if (!response.ok) {
        showError('Failed to fetch recommendations');
        return null;
    }

    const playlistData = await response.json();
    return playlistData.playlists.items;
}




