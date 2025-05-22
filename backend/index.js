const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }));
app.use(cookieParser());

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-modify-public',
  'playlist-modify-private'
].join(' ');

// 1. Login route
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

// 2. Callback route
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

// 3. Protected route
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

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
