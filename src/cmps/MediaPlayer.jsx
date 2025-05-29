import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
// import { setIsPlaying } from '../store/actions/station.actions.js'
// import { SET_NEXT_SONG, SET_PREV_SONG } from '../store/reducers/station.reducer'
// import { toggleLike } from '../store/actions/user.actions'

import { ReactYouTube } from './ReactYoutube.jsx'

import PlayBtn from '../assets/icons/media-player/play_small.svg?react'
import PauseBtn from '../assets/icons/media-player/pause_small.svg?react'
import PrevBtn from '../assets/icons/media-player/prev_song.svg?react'
import NextBtn from '../assets/icons/media-player/next_song.svg?react'

import ShuffleBtn from '../assets/icons/media-player/shuffle.svg?react'
import RepeatBtn from '../assets/icons/media-player/repeat.svg?react'

// TODOs:
// [v] all icons to folder
// [v] btns - play, pause, next, prev, shuffle, repeat,
// [] add dispatch(setIsPlaying())
// [] fix bug

//  

/*

- put inside stationReducer:

const SET_IS_PLAYING = 'SET_IS_PLAYING'

 case SET_IS_PLAYING:
            return { ...state, isPlaying: !state.isPlaying }



- put inside stationAction:

export async function setIsPlaying() {
    try {
        store.dispatch({type: SET_IS_PLAYING})
    } catch (err) {
        console.log('Cannot set isPlaying ', err)
        throw err
    }
}            

*/


export function MediaPlayer() {


    const songIdx = useSelector(storeState => storeState.stationModule.currentSongIdx)
    const currentSong = useSelector(storeState => storeState.stationModule.currentSong)
    const isPlaying = useSelector(storeState => storeState.stationModule.isPlaying)

    const dispatch = useDispatch()

    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const playerRef = useRef(null)

    const song = currentSong

    useEffect(() => {
        const interval = setInterval(() => {
            if (!playerRef.current || !isPlaying) return

            const currentTime = playerRef.current.getCurrentTime?.()
            const totalTime = playerRef.current.getDuration?.()
            if (typeof currentTime === 'number' && typeof totalTime === 'number') {
                setProgress(currentTime)
                setDuration(totalTime)
            }
        }, 500)

        return () => clearInterval(interval)
    }, [song, isPlaying, songIdx])


    function onEnd() {
            nextSong()
    }

    function togglePlay() {
        if (!playerRef.current) return

        if (isPlaying) {
            playerRef.current.pauseVideo()
        } else {
            playerRef.current.playVideo()
        }

        dispatch(setIsPlaying())

    }

    function nextSong() {
        dispatch({ type: SET_NEXT_SONG })
    }

    function prevSong() {
        dispatch({ type: SET_PREV_SONG })
    }

    function formatTime(sec) {
        const minutes = Math.floor(sec / 60)
        const seconds = Math.floor(sec % 60).toString().padStart(2, '0')
        return `${minutes}:${seconds}`
    }

    return (
        <footer className="media-player">
           
            <div className="track-controls">
                <div className="track-nav-container">

                    <button className='previous-btn-button' onClick={prevSong} disabled={!song}>
                        <PrevBtn className="previous-btn" />
                    </button>

                    <button className="play-btn" onClick={togglePlay} disabled={!song}>
                        {isPlaying ? <PauseBtn className="pause-svg" /> : <PlayBtn />}
                    </button>

                    <button className='next-btn-button' onClick={nextSong} disabled={!song}>
                        <NextBtn className="next-btn" />
                    </button>

                </div>
                <div className="track-seek-container">
                    <div className='track-time'>{formatTime(progress)}</div>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={progress}
                        step="0.1"
                        onChange={(ev) => {
                            const newTime = +ev.target.value
                            playerRef.current.seekTo(newTime, true)
                            setProgress(newTime)
                        }}
                        className="seek-bar"
                        style={{
                            '--seek-fill': duration ? `${(progress / duration) * 100}%` : '0%'
                        }}
                    />
                    <div className='track-time'>{formatTime(duration)}</div>
                </div>
            </div>

            {song && (
                <span className="react-youtube">
                    {/* <ReactYouTube
                        key={song.url}
                        videoId={song.url}
                        isPlaying={isPlaying}
                        // volume={volume}
                        volume={50}
                        playerRef={playerRef}
                        onEnd={onEnd}
                    /> */}
                </span>
            )}
        </footer>
    )
}






// import { useState } from 'react'
// import { PlayButton } from './PlayButton'
// import { FaStepForward, FaStepBackward } from 'react-icons/fa'
// import { useDispatch, useSelector } from 'react-redux'
// import { updateIsPlaying } from '../store/system/system.actions'


// export function MediaPlayer() {

//   const song = useSelector((storeState) => storeState.systemModule.song)
//   const isPlaying = useSelector((storeState) => storeState.systemModule.isPlaying)

//   const dispatch = useDispatch()

//   async function togglePlay() {
//     try {
//         dispatch(updateIsPlaying())
//         // TODO - later on add socket to play in other user as well as a BONUS 
//     } catch (err) {
//         console.log('togglePlay err: ',err)
//     }
//   }

//   return (
//     <div className="">
//       {/* Song Info */}

//       {/* Controls */}
//       <div className="flex items-center gap-6">
//         <FaStepBackward className="cursor-pointer hover:text-green-500" />
//         <PlayButton onToggle={togglePlay} />
//         <FaStepForward className="cursor-pointer hover:text-green-500" />
//       </div>

//       {/* Progress bar (placeholder) */}
//       <div className="w-1/3 hidden md:block">
//         <div className="h-1 bg-gray-700 rounded-full">
//           <div className="w-1/3 h-1 bg-green-500 rounded-full" />
//         </div>
//       </div>
//     </div>
//   )
// }
