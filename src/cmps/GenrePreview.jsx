export function GenrePreview({ genreName, color, imgUrl = '' }) {
    return (
        <div className="genre-preview" role="listitem">
            <a className="genre-link" href="#">
                <div
                    className="genre-tile"
                    style={{ backgroundColor: color }}
                >
                    {/* Uncomment when imgUrl is used */}
                    <img
                        aria-hidden="true"
                        draggable="false"
                        loading="lazy"
                        src={imgUrl}
                        alt={`${genreName} cover`}
                        className="genre-img"
                    />
                    <span
                        className="genre-name"
                        title={genreName}
                    >
                        {genreName}
                    </span>
                </div>
            </a>
        </div>
    )
}
