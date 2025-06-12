# Minion
**Discover your top Spotify songs and artists across time — plus generate playlists to find new songs!** 

**https://stirring-kangaroo-2cf80d.netlify.app/**
### Disclaimers

- **Spotify Login**
  - This applicaiton uses the Spotify Web API to access user data.
  - To enable this, a Spotify developer app was created, which is currently in development mode. This means only users who are manually added to an allowlist can log in.
  - If you're interested in trying it out, feel free to contact me via GitHub or email me at haley.slaney@gmail.com.
  - As of May 15th 2025, Spotify only allows organizations to use their "Extended Quota Mode" which doesn't require an allowlist. For more information on this, explore [here](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)
- **Initial Load May Be Slow**
  - The backend is hosted on Render, which was chosen to handle requests to the Spotify API and manage secure cookies. (See below for reasoning.)
  - However, Render puts free-tier services to sleep after 15 minutes of inactivity, causing the first request after a dormant period to take around 30–45 seconds to respond.
  - After this initial delay, subsequent requests should be fast and responsive.
- **Cookies**
  - Cookies are used to securely store the Spotify access token and refresh token.
  - The application has been tested and works in Edge, Chrome, and Firefox.
## Frontend
### [Netlify](https://www.netlify.com/)
- Netlify is a cloud platform that makes it easy to deploy and host websites, especially those built with modern frontend tools like React, Vite, Vue, or static site generators.
- It automates the process of building, deploying, and serving the site from this Git repository, and provides features like:
  - Free hosting with global CDN (Content Delivery Network)
  - Automatic builds from Git pushes
  - HTTPS and custom domain support
  - Built-in support for environment variables, redirects, and more

- Due to the simplicity, flexibility, and seamless Vite/React support, it was the right choice for this project.
### [React](https://react.dev/), [Vite](https://vite.dev/), & [Redux Hooks](https://react-redux.js.org/api/hooks)
- This project uses React for building the user interface and Vite as the frontend build tool.
- React provides a fast, component-based architecture for building interactive UIs, making it ideal for rendering user playlists, search results, and handling dynamic state updates.
- Vite was chosen as the build tool for its blazing-fast development server, instant hot module replacement (HMR), and lightweight configuration.
- Redux hooks improve the scalability, readability, and maintainability of the app by centralizing logic for API data (like playlists and user info), keeping things organized and consistent.
  - Still working on expanding state usage and exploring new ways to leverage Redux hooks for more interactive features and better data handling.


## Backend
### [Render](https://render.com/)
- Render is a cloud platform that simplifies hosting backend services and APIs. It provides a secure, scalable environment with easy deployment from Git repositories, automated SSL, and global availability.
- It was chosen for similar reasons as Netlify:
  - Easy deployment: Connects directly to GitHub for continuous deployment.
  - Secure: Provides HTTPS by default, which is critical for handling sensitive authentication cookies.
  - Scalable: Handles API requests reliably without complex infrastructure setup.
  - Free tier: Offers a free solution for small projects and prototypes.
- The backend hosted on Render acts as a proxy to the Spotify Web API, securely handling requests on behalf of the frontend.
- It manages HTTP-only cookies to store sensitive Spotify access tokens and refresh tokens, enhancing security by keeping tokens out of the browser’s JavaScript context.
- Render’s backend sleeps after periods of inactivity, which can cause a delay on the first request, but this trade-off is acceptable for this project's scale and cost constraints.


## Images of Application
### Initial Login Page
![LoginScreenImage](https://github.com/user-attachments/assets/8633c9ce-a864-4aff-9766-5ec6700a2592)
### Home Page
![HomePageImage](https://github.com/user-attachments/assets/b1fe9e47-4a40-42df-9a12-bfe2f913f33f)
### Top Artists
**Please note that the amount and time range(short, medium, and long) can be changed.**
![TopArtistsImage](https://github.com/user-attachments/assets/34bcb0a9-c6c2-4ac2-9112-e3858136d6d7)
### Top Tracks
**Please note that the amount and time range(short, medium, and long) can be changed.**
![TopTracksImage](https://github.com/user-attachments/assets/09efbe4b-d5a6-40ca-87ee-2768be8a9a33)
### Playlist Builder
**Initial Page**
![InitalPlaylistBuilderPage](https://github.com/user-attachments/assets/f1224671-9714-4635-a2dc-f3ff49d83168)
**Page with input**

The user can enter up to 5 of each:
1. Tracks
2. Genres - has a drop down with Spotify Genres
3. Artists

The user can also change the song limit for the playlist.

Once the user is content and has provided at least one seed, they can create a playlist.
![PlaylistBuilderWithInput](https://github.com/user-attachments/assets/492faf8a-14da-4bac-8dbf-a441c9e95284)
**Results Part 1 - Inspiring Playlists**

The results of the generate playlist button include two parts: 
1. Inspiring playlists that are used for songs
2. Resulting playlist with songs from the inspiring playlists

In the image below, we begin to see the inspiring playlist section.

![PlaylistBuilderResults1](https://github.com/user-attachments/assets/1032dacb-c73b-4d8c-9256-85c7e8058336)
**Results Part 2 - Inspiring Playlists & Resulting Tracks**

This image shows more of the results, showing that the resulting tracks are below the inspired playlist section.

The user is able to remove songs that they don't want included in their playlist.

![PlaylistBuilderResults2](https://github.com/user-attachments/assets/3b79df3b-9ad5-4c03-9b6b-587e2b3fa6fa)
**Results Part 3 - Resulting Tracks**

This image shows more of the resulting tracks.

![PlaylistBuilderResults3](https://github.com/user-attachments/assets/dbe92c90-5cd0-4f12-8d52-48b1046ed50b)
**Create Playlist Popup**

Once the "Create Playlist" button is pressed, the following popup appears.
![CreatePlaylist](https://github.com/user-attachments/assets/de609e32-866c-4b03-a218-5fc35f697a87)
### Account Information
![AccountInformationPage](https://github.com/user-attachments/assets/043e2939-0c2e-4249-8557-a784c79b855e)

