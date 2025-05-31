import { Header } from './GeneralComponents';

function TopArtistsHeading({ timeRange, setTimeRange, amount, setAmount }) {
  return (
    <div className='container'>
      <header>
        <h2>Your Top Artists</h2>
      </header>
      <div className="filters">
        <label htmlFor="time-range">Time Range:</label>
        <select
          id="time-range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="filter-input"
        >
          <option value="short_term">Short Term</option>
          <option value="medium_term">Medium Term</option>
          <option value="long_term">Long Term</option>
        </select>

        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          min="1"
          max="50"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="filter-input"
        />
      </div>
    </div>
  );
}

function ArtistsList({ favoriteArtists }) {
  return (
    <div className="results-list">
      {favoriteArtists.map((artist) => (
        <div key={artist.id} className="result-card">
          <img
            src={artist.images[0]?.url}
            alt={artist.name}
            className="result-image"
          />
          <h3>{artist.name}</h3>
          <p>Followers: {artist.followers.total.toLocaleString()}</p>
          <p>Popularity: {artist.popularity}</p>
          <a
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Spotify
          </a>
        </div>
      ))}
    </div>
  );
}

export default function TopArtistsVisual({
  timeRange,
  setTimeRange,
  amount,
  setAmount,
  favoriteArtists,
}) {
  return (
    <div>
      <Header />
      <TopArtistsHeading
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        amount={amount}
        setAmount={setAmount}
      />
      <ArtistsList favoriteArtists={favoriteArtists} />
    </div>
  );
}
