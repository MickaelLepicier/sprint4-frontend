import { cleanTitle } from "../services/util.service"
import { SidebarPlayBtn } from "./Sidebar/SidebarPlayBtn"

export function SongCard({ song }) {
    
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
                        <div></div>
                        <p className="song-name">{cleanTitle(song.title)}</p>
                        {/* {station.artist && (
                            <p className="station-artist">{station.artist}</p>
                        )} */}
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
