// SpotifyLoader.jsx

export function SpotifyLoader() {

    return (
        <div className="spotify-loader-backdrop">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1 100"
                role="progressbar"
                aria-valuetext="Loading"
                className="spotify-loader-svg"
            >
                <circle cx="-140" cy="50" r="32" className="spotify-loader-dot dot1" />
                <circle cx="0"    cy="50" r="32" className="spotify-loader-dot dot2" />
                <circle cx="140"  cy="50" r="32" className="spotify-loader-dot dot3" />
            </svg>
        </div>
    )
}