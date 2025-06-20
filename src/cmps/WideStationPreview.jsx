import { cleanTitle } from "../services/util.service";

export function WideStationPreview({ station, goToStation, setImgHover }) {
  return (
    <div 
      className="wide-station-preview" 
      role="listitem" 
      onClick={() => goToStation(station)}
      onMouseEnter={() => setImgHover(station?.imgUrl)}
      // onMouseEnter={() => setImgHover('https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/artistmix/2vPzfdWIYB3zCD8qEIvMM0/en')}
      onMouseLeave={() => setImgHover(null)}  
    >
      <button className="play-btn" aria-label={`Play ${station.name} by ${station.artist}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
        </svg>
      </button>
      <div className="img-container">
        <img src={station.imgUrl} alt={station.name} draggable="false" loading="lazy" />
      </div>

      <div className="info">
        <p className="station-name">{cleanTitle(station.name)}</p>
        {station.artist && <p className="station-artist">{station.artist}</p>}
      </div>
    </div>
  )
}
