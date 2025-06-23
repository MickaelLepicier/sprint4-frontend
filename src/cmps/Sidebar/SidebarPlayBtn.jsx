import { useSelector } from 'react-redux'
import { setSong, setIsPlaying, setShuffledOrder } from '../../store/station/station.actions'
import { SidebarPlayIcon } from '../svg/SidebarPlayIcon'
import { SidebarPauseIcon } from '../svg/SidebarPauseIcon'
import { SetActionBtn } from '../util/SetActionBtn'

export function SidebarPlayBtn({ station }) {
    const isPlaying = useSelector(store => store.stationModule.isPlaying)
    const isShuffle = useSelector(store => store.stationModule.isShuffle)
    const currentStation = useSelector(store => store.stationModule.currentStation)

    const isCurrStationPlaying = currentStation?._id === station._id && isPlaying

    function handleTogglePlay(ev) {
        ev.stopPropagation()
        const playerRef = window.playerRef?.current
        if (!playerRef) return

        if (currentStation?._id === station._id) {
            if (isPlaying) {
                playerRef.pauseVideo()
                setIsPlaying(false)
            } else {
                playerRef.playVideo()
                setIsPlaying(true)
            }
        } else {
            if (!station?.songs?.length) return

            let nextSong
            if (isShuffle) {
                const shuffled = shuffleArray(station.songs)
                setShuffledOrder(shuffled)
                nextSong = shuffled[0]
            } else {
                nextSong = station.songs[0]
            }
            setSong(nextSong, station)
            setIsPlaying(true)
        }
    }

    const iconCmp = isCurrStationPlaying
        ? <SidebarPauseIcon color="#fff" />
        : <SidebarPlayIcon color="#fff" />

    return (
        <SetActionBtn
            currIcon={iconCmp}
            addClassName="sidebar-play-btn"
            onClick={handleTogglePlay}
            ariaLabel="Play station"
            title="Play station"
        />
    )
}

// Use your friend's function as-is!
function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}
