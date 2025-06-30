import { useSelector } from 'react-redux'
import { setSong, setIsPlaying, setShuffledOrder } from '../../store/station/station.actions'
import { PlayStandardIcon } from '../svg/PlayStandardIcon'
import { PauseStandardIcon } from '../svg/PauseStandardIcon'
import { PlayLargeIcon } from '../svg/PlayLargeIcon'
import { PauseLargeIcon } from '../svg/PauseLargeIcon'
import { SetActionBtn } from '../util/SetActionBtn'

export function SidebarPlayBtn({ station, song = null, isLargePlayIcon = false }) {
    const isPlaying = useSelector(store => store.stationModule.isPlaying)
    const isShuffle = useSelector(store => store.stationModule.isShuffle)
    const currentStation = useSelector(store => store.stationModule.currentStation)
    const currentSong = useSelector(store => store.stationModule.currentSong)

    // Decide what is currently playing (song or station)
    const isCurrStationPlaying = song
        ? currentSong?.id === song.id && isPlaying
        : currentStation?._id === station._id && isPlaying

    const iconCmp = isCurrStationPlaying
        ? isLargePlayIcon ? <PauseLargeIcon /> : <PauseStandardIcon />
        : isLargePlayIcon ? <PlayLargeIcon /> : <PlayStandardIcon />

    function handleTogglePlay(ev) {
        ev.stopPropagation()
        const playerRef = window.playerRef?.current
        if (!playerRef) return

        // PLAY INDIVIDUAL SONG
        if (song) {
            // Already playing this song?
            if (currentSong?.id === song.id && isPlaying) {
                playerRef.pauseVideo()
                setIsPlaying(false)
            } else if (currentSong?.id === song.id && !isPlaying) {
                playerRef.playVideo()
                setIsPlaying(true)
            } else {
                setSong(song, station)
                setIsPlaying(true)
            }
            return
        }

        // PLAY STATION (playlist)
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
            id="play-pause-btn"
            onClick={handleTogglePlay}
            ariaLabel={song ? "Play song" : "Play station"}
            title={song ? "Play song" : "Play station"}
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
