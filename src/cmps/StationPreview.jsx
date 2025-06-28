import { cleanTitle } from "../services/util.service"
import { SidebarPlayBtn } from "./Sidebar/SidebarPlayBtn"

export function StationPreview({ station,goToStation }) {
    
    const imgUrl = station?.imgUrl ? station?.imgUrl : `https://res.cloudinary.com/dirlnkakz/image/upload/v1747039279/${station?.createdBy.imgUrl}`

    return (
        <div className="station-preview-container">
            <div className="station-preview" role="listitem" onClick={()=>{goToStation(station)}}>
                <div className="img-container">
                    <img
                        src={station.imgUrl || imgUrl}
                        alt={station.name}
                        draggable="false"
                        loading="lazy"
                    />
                    <div className="btn-container encore-bright-accent-set">
                        <SidebarPlayBtn station={station} />
                    </div>
                </div>

                <div className="info-container">
                    <div className="info">
                        <div></div>
                        <p className="station-name">{cleanTitle(station.name)}</p>
                        {station.artist && (
                        <p className="station-artist">{station.artist}</p>
                        )}
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
