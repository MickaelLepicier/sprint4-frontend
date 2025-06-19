export function GenrePreview({ genreName, color, imgUrl = '',onClickGenre }) {
    return (
        <div className="genre-preview" role="listitem" onClick={onClickGenre}>
            <a className="genre-link" href="#">
                <div
                    className="genre-title"
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
