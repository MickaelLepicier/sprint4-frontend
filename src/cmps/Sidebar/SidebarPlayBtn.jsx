import { useSelector } from 'react-redux'
import { setSong, setIsPlaying, setShuffledOrder } from '../../store/station/station.actions'
import { PlayStandardIcon } from '../svg/PlayStandardIcon'
import { PauseStandardIcon } from '../svg/PauseStandardIcon'
import { PlayLargeIcon } from '../svg/PlayLargeIcon'
import { PauseLargeIcon } from '../svg/PauseLargeIcon'
import { SetActionBtn } from '../util/SetActionBtn'

export function SidebarPlayBtn({ station, isLargePlayIcon = false }) {
    const isPlaying = useSelector(store => store.stationModule.isPlaying)
    const isShuffle = useSelector(store => store.stationModule.isShuffle)
    const currentStation = useSelector(store => store.stationModule.currentStation)

    const isCurrStationPlaying = currentStation?._id === station._id && isPlaying


    let iconCmp
    if (isCurrStationPlaying) {
        iconCmp = isLargePlayIcon ? <PauseLargeIcon /> : <PauseStandardIcon />
    } else {
        iconCmp = isLargePlayIcon ? <PlayLargeIcon /> : <PlayStandardIcon />
    }

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

function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}
