import { PlayIcon } from "../svg/PlayIcon"
import { useState } from "react"

export function SidebarPreview({ playlist }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <li
            className="sidebar-preview"
            draggable="true"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="img-wrapper">
                <img src={playlist.imgUrl} alt={playlist.title} draggable="false" />
                {isHovered && (
                    <button className="play-btn" aria-label={`Play ${playlist.title}`}>
                        <PlayIcon />
                    </button>
                )}
            </div>

            <div className="details">
                <h3>{playlist.title}</h3>
                <p>
                    {playlist.isLiked ? (
                        <svg className="pin-icon" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M8.822.797a2.72 2.72 0 0 1 3.847 0l2.534 2.533a2.72 2.72 0 0 1 0 3.848l-3.678 3.678-1.337 4.988-4.486-4.486L1.28 15.78a.75.75 0 0 1-1.06-1.06l4.422-4.422L.156 5.812l4.987-1.337L8.822.797z" />
                        </svg>
                    ) : null}
                    <span>Playlist</span>
                    <span className="dot">•</span>
                    <span>{playlist.songCount} {playlist.songCount === 1 ? 'song' : 'songs'}</span>
                </p>
            </div>
        </li>
    )
}
