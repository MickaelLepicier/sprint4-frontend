export function SidebarPreview({ playlist }) {
    return (
        <div className="sidebar-preview" role="row" draggable="true">
            <div className="thumb">
                <img
                    src={playlist.imgUrl}
                    alt={playlist.title}
                    loading="eager"
                    draggable="false"
                />
                <button className="play-btn" aria-label={`Play ${playlist.title}`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7.05 3.606 20.54 11.394a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
                    </svg>
                </button>
            </div>
            <div className="info">
                <p className="title">{playlist.title}</p>
                <p className="type">{playlist.type}</p>
            </div>
        </div>
    )
}
