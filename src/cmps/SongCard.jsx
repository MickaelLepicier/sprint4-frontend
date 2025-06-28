import { cleanTitle } from "../services/util.service"
import { SidebarPlayBtn } from "./Sidebar/SidebarPlayBtn"

export function SongCard({ song }) {
    
    function removeParentheses(str) {
        return str.replace(/\s*\([^)]*\)/g, '').trim()  
    }

    return (
        <div className="song-card-container">
            <div className="song-card">
                <div className="img-container">
                    <img
                        src={song.imgUrl || imgUrl}
                        alt={song.name}
                        draggable="false"
                        loading="lazy"
                    />
                    <div className="btn-container encore-bright-accent-set">
                        <SidebarPlayBtn song={song} isLargePlayIcon={true} />
                    </div>
                </div>

                <div className="info-container">
                    <div className="info">
                        {song.artist
                            ? <p className="song-artist">{song.artist}</p>
                            : <div></div>
                        }
                        <p className="song-name">{removeParentheses(song.title)}</p>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
