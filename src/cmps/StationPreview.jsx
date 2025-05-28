import { Link } from 'react-router-dom'

export function StationPreview({ station }) {
  console.log('station:', station)
  return (
    <article className="station-preview">
      <Link to={`/playlist/${station._id}`}>
        {/* <img src={station.imgUrl} alt="https://img.freepik.com/premium-vector/musical-note-hand-drawn_356740-459.jpg" /> */}
        <img
          style={{ width: 100 + 'px', height: 100 + 'px' }}
          src="https://img.freepik.com/premium-vector/musical-note-hand-drawn_356740-459.jpg"
          alt="Musical noteMusical note"
        />
        <h1>{station.name}</h1>
      </Link>
    </article>
  )
}
