const token = localStorage.getItem('spotifyToken');

export const getPlaylistContent = async(playlistId) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const response = await fetch(url, {
        headers: {
        Authorization: `Bearer ${token}` 
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch playlist ${playlistId}: ${response.status}`);
    }

    const data = await response.json();
    const tracks = data.items
        .filter(item => item && item.track) 
        .map(item => item.track);

    return tracks;
}

export const getUserId = async() => {
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
    return userId
}

export const createPlaylist = async(playlistName, description, isPublic) => {
    const userId = await getUserId()
    console.log(userId)
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
            description: description ?? `Generated with ${import.meta.env.VITE_APP_NAME}`,
            public: isPublic,
          }),
        }
    );

    if (!playlistResponse.ok) {
        throw new Error('Failed to create playlist');
    }

    const playlistData = await playlistResponse.json();
     
    return playlistData;
}

export const addTracksToPlaylist = async (playlistId, trackUris) => {
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
}

export const searchForPlaylistItems = async (requestType) => {
    const queryString = requestType.toString();
    const url = `https://api.spotify.com/v1/search?q=${queryString}&type=playlist`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }

    const data = await response.json();
    return data.playlists.items
 
}




