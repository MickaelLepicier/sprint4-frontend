import { StationCarousel } from './StationCarousel'

export function StationShelf({ title, stations, goToStation }) {
    if (!stations.length) return null

    return (
        <section className="playlist-container">
            <div className="playlist-header">
                <h1 className="row-title">{title}</h1>
            </div>
            <StationCarousel stations={stations} goToStation={goToStation} />
        </section>
    )
}
