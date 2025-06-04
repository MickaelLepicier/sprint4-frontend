export function SidebarLikedSongs({
    likedSongsCount,
    onClickPlaylist,
    likedSongsStationId,
    isSelected 
}) {
    return (
        <li
            className={`sidebar-preview${isSelected ? ' selected' : ''}`}
            draggable="true"
            onClick={() => onClickPlaylist(likedSongsStationId)}
        >
            <div className="img-wrapper">
                <img
                    src="https://misc.scdn.co/liked-songs/liked-songs-64.png"
                    alt="Liked Songs"
                    draggable="false"
                />
                {/* <button className="play-btn" aria-label="Play Liked Songs">
                    ▶
                </button> */}
            </div>

            <div className="details">
                <h3>Liked Songs</h3>
                <p>
                    {/* <svg className="pin-icon" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8.822.797a2.72 2.72 0 0 1 3.847 0l2.534 2.533a2.72 2.72 0 0 1 0 3.848l-3.678 3.678-1.337 4.988-4.486-4.486L1.28 15.78a.75.75 0 0 1-1.06-1.06l4.422-4.422L.156 5.812l4.987-1.337L8.822.797z" />
                    </svg> */}
                    <span className="pin-icon">
                        <svg
                            viewBox="0 0 16 16"
                            role="img"
                            aria-label="Pinned"
                        >
                            <title>Pinned</title>
                            <path d="M8.822.797a2.72 2.72 0 0 1 3.847 0l2.534 2.533a2.72 2.72 0 0 1 0 3.848l-3.678 3.678-1.337 4.988-4.486-4.486L1.28 15.78a.75.75 0 0 1-1.06-1.06l4.422-4.422L.156 5.812l4.987-1.337L8.822.797z" />
                        </svg>
                    </span>
                    <span>{`Playlist • ${likedSongsCount} ${likedSongsCount === 1 ? 'song' : 'songs'}`}</span>
                </p>
            </div>
        </li>
    )
}
