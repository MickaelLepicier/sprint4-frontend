export function GenrePreview({ genreName, color, imgUrl = '', onClickGenre }) {
    return (
        <div className="genre-preview" role="listitem" onClick={onClickGenre}>
            <a className="genre-link" href="#" onClick={(ev) => {ev.preventDefault()}}>
                <div className="genre-box" style={{ backgroundColor: color }}>
                    <img
                        className="genre-img"
                        src={imgUrl}
                        alt={`${genreName} cover`}
                        aria-hidden="true"
                        draggable="false"
                        loading="lazy"
                    />
                    <span className="genre-name" title={genreName}>
                        <span>{genreName}<wbr /></span>
                    </span>
                </div>
            </a>
        </div>
    )
}