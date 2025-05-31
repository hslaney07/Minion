const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'https://stirring-kangaroo-2cf80d.netlify.app',//process.env.FRONTEND_URI, 
  credentials: true,
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  // Check for valid session/token
  const token = req.cookies.spotifyAccessToken || req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verify token (example using JWT)
  try {
    req.user = verifyToken(token); // Your verification logic
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});


const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-modify-public',
  'playlist-modify-private'
].join(' ');

app.get('/login', (_, res) => {
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
      sameSite: 'None',
      path: '/',
      domain: '.onrender.com', // Or your custom domain
      partitioned: true, 
    });

    res.cookie('spotifyRefreshToken', refresh_token, {
      httpOnly: true,
      secure: true,
        path: '/',
      domain: '.onrender.com', // Or your custom domain
      partitioned: true, 
          sameSite: 'None'
    });


    // Redirect back to frontend
    res.send(`
    <html>
      <head>
        <title>Logging you in...</title>
        <script>
          // Delay a bit to ensure cookies are saved
          setTimeout(() => {
            window.location.href = '${process.env.FRONTEND_URI}/Home';
          }, 1000);
        </script>
      </head>
      <body>
        <p>Logging you in, please wait...</p>
      </body>
    </html>
  `);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

async function spotifyRequest(req, res, requestFn) {
  let accessToken = req.cookies.spotifyAccessToken;
  const refreshToken = req.cookies.spotifyRefreshToken;

  try {
    return await requestFn(accessToken);
  } catch (err) {
    if (err.response?.status === 401 && refreshToken) {
      // Try refreshing the token
      try {
        const refreshed = await refreshAccessToken(refreshToken);
        accessToken = refreshed.access_token;

        // Update the cookie
        res.cookie('spotifyAccessToken', accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: refreshed.expires_in * 1000,
          sameSite: 'None',
          path: '/',
          domain: '.onrender.com', // Or your custom domain
          partitioned: true, 
        });

        // Retry the original request with new token
        return await requestFn(accessToken);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
        return res.sendStatus(401);
      }
    } else {
      console.error('Spotify request failed:', err.response?.data || err.message);
      return res.sendStatus(err.response?.status || 500);
    }
  }
}

app.options('/me', cors(corsOptions));

app.get('/me', cors(corsOptions), async (req, res) => {
  try {
    await spotifyRequest(req, res, async (token) => {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Add security headers to the response
      res.set('X-Content-Type-Options', 'nosniff');
      res.json(response.data);
    });
  } catch (error) {
    console.error('Spotify API error:', error);
    
    // Handle different error cases
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Spotify token expired' });
    }
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

app.post('/logout', (_, res) => {
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
  const { name, description, isPublic } = req.body;

  await spotifyRequest(req, res, async (token) => {
    // get user's Spotify ID
    const userRes = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userId = userRes.data.id;

    // create playlist
    const playlistRes = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name,
        description: description,
        public: isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(playlistRes.data);
  });
});

app.post('/get-playlist-content', async (req, res) => {
  const playlistId = req.body.playlistId;

  await spotifyRequest(req, res, async (token) => {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
        Authorization: `Bearer ${token}` 
        }
    });
    res.json(response.data);
  });
});

app.post('/add-tracks-to-playlist', async (req, res) => {
  const { playlistId, uris } = req.body;

  await spotifyRequest(req, res, async (token) => {
    const addTracksResponse = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: uris, 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(addTracksResponse.data);
  });
});

app.post('/search-for-playlist-items', async (req, res) => {
  const requestType = req.body.requestType;

  await spotifyRequest(req, res, async (token) => {
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
  });
});

app.post('/get-top-artists', async (req, res) => {
  const {amount, timeRange} = req.body;

  await spotifyRequest(req, res, async (token) => {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/artists?limit=${amount}&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  });
});

app.post('/get-top-tracks', async (req, res) => {
  const {amount, timeRange} = req.body;

  await spotifyRequest(req, res, async (token) => {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?limit=${amount}&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  });
});

async function refreshAccessToken(refreshToken) {
  const response = await axios.post('https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }).toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  return response.data; // contains access_token and optionally a new refresh_token
}

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running!`);
});
