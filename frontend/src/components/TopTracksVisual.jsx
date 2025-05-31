import { Header } from './GeneralComponents';

function TopTracksHeading({ timeRange, setTimeRange, amount, setAmount }) {
  return (
    <div className='container'>
      <header>
        <h2>Your Top Tracks</h2>
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

function TracksList({ topTracks }) {
  return (
    <div className="results-list">
      {topTracks.map((track) => (
        <div key={track.id} className="result-card">
          <img
            src={track.album.images[0]?.url}
            alt={track.name}
            className="result-image"
          />
          <h3>{track.name}</h3>
          <p>Artist: {track.artists.map((artist) => artist.name).join(', ')}</p>
          <p>Album: {track.album.name}</p>
          <p>Popularity: {track.popularity}</p>
          <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
            Listen on Spotify
          </a>
        </div>
      ))}
    </div>
  );
}

export default function TopTracksVisual({
  timeRange,
  setTimeRange,
  amount,
  setAmount,
  topTracks,
}) {
  return (
    <div >
      <Header />
      <TopTracksHeading
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        amount={amount}
        setAmount={setAmount}
      />
      <TracksList topTracks={topTracks} />
    </div>
  );
}
