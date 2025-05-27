import { Link } from 'react-router-dom'

export function StationPreview({ station }) {
    return (
        <article className="preview">
            <header>
                <Link to={`/station/${station._id}`}>{station.vendor}</Link>
            </header>

            <p>Speed: <span>{station.speed.toLocaleString()} Km/h</span></p>
            {station.owner && <p>Owner: <Link to={`/user/${station.owner._id}`}>{station.owner.fullname}</Link></p>}

        </article>
    )
}