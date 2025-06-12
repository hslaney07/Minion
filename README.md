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
