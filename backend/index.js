const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }));
app.use(cookieParser());
app.use(express.json())

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-modify-public',
  'playlist-modify-private'
].join(' ');

app.get('/login', (req, res) => {
  const redirectUri = 'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: process.env.REDIRECT_URI
    });

  res.redirect(redirectUri);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // Set secure HTTP-only cookies
    res.cookie('spotifyAccessToken', access_token, {
      httpOnly: true,
      secure: true,
      maxAge: expires_in * 1000,
      sameSite: 'Lax'
    });

    res.cookie('spotifyRefreshToken', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax'
    });

    // Redirect back to frontend
    res.redirect(process.env.FRONTEND_URI);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/me', async (req, res) => {
  const token = req.cookies.spotifyAccessToken;
  if (!token) return res.sendStatus(401);

  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.json(response.data);
  } catch (err) {
    res.sendStatus(401);
  }
});


app.post('/logout', (req, res) => {
  res.clearCookie('spotifyAccessToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax'
  });
  res.clearCookie('spotifyRefreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax'
  });
  res.sendStatus(200);
});

app.post('/create-playlist', async (req, res) => {
  const { name, description, public: isPublic } = req.body;

  const accessToken = req.cookies.spotifyAccessToken;
  if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Get user's Spotify ID
    const userRes = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userId = userRes.data.id;

    // Create playlist
    const playlistRes = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name,
        description: description,
        public: isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(playlistRes.data);
  } catch (err) {
    console.error('Create Playlist Error:', err.response?.data || err);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

app.post('/get-playlist-content', async (req, res) => {
  const token = req.cookies.spotifyAccessToken;
  if (!token) return res.sendStatus(401);

  const playlistId = req.body.playlistId;

  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
        Authorization: `Bearer ${token}` 
        }
    });
    res.json(response.data);
  } catch (err) {
    res.sendStatus(401);
  }
});

app.post('/add-tracks-to-playlist', async (req, res) => {
  const token = req.cookies.spotifyAccessToken;
  if (!token) return res.sendStatus(401);

  const { playlistId, trackUris } = req.body;

  try {
    const addTracksResponse = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackUris, // This is the actual POST body
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(addTracksResponse.data);
  } catch (err) {
    console.error('Error adding tracks:', err.response?.data || err.message);
    res.sendStatus(401);
  }
});

app.post('/search-for-playlist-items', async (req, res) => {
  const token = req.cookies.spotifyAccessToken;
  if (!token) return res.sendStatus(401);

  const requestType = req.body.requestType;

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: requestType,
          type: 'playlist',
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Error searching for playlist items:', err.response?.data || err.message);
    res.sendStatus(401);
  }
});

app.post('/get-top-artists', async (req, res) => {
  const token = req.cookies.spotifyAccessToken;
  if (!token) return res.sendStatus(401);

  const {amount, timeRange} = req.body;

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/artists?limit=${amount}&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Error searching for playlist items:', err.response?.data || err.message);
    res.sendStatus(401);
  }
});

app.post('/get-top-tracks', async (req, res) => {
  const token = req.cookies.spotifyAccessToken;
  if (!token) return res.sendStatus(401);

  const {amount, timeRange} = req.body;

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?limit=${amount}&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Error searching for playlist items:', err.response?.data || err.message);
    res.sendStatus(401);
  }
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
