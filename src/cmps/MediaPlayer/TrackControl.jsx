import { ReactYouTube } from '../ReactYouTube.jsx'
import { nextSong, prevSong, setIsPlaying, setIsShuffle, setShuffledOrder } from '../../store/station/station.actions.js'
import { PlayBtn } from '../PlayBtn.jsx'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { SetTrackBtn } from '../SetTrackBtn.jsx'
import { TrackSeek } from './TrackSeek.jsx'

export function TrackControl({ currSong, volume }) {
  const isPlaying = useSelector((storeState) => storeState.stationModule.isPlaying)
  // const station = useSelector((storeState) => storeState.stationModule.station)
  const currStation = useSelector((storeState) => storeState.stationModule.currentStation)

  // shuffle
  // const [shuffledOrder, setShuffledOrder] = useState([])
  const shuffledOrder = useSelector(state => state.stationModule.shuffledOrder)
  const [originalOrder, setOriginalOrder] = useState([])

  // track time
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const [isRepeat, setIsRepeat] = useState(false)
  // const [isShuffle, setIsShuffle] = useState(false)
  const isShuffle = useSelector(state => state.stationModule.isShuffle)

  const playerRef = useRef(null)
  window.playerRef = playerRef

  const isNotAllowed = !playerRef.current || !currSong
  const isNotAllowedCN = isNotAllowed ? 'not-allowed' : ''
  const isPlay = isPlaying ? 'track-control-pause-icon' : 'track-control-play-icon'

  const repeatActive = isRepeat ? 'active-green' : ''
  const shuffleActive = isShuffle ? 'active-green' : ''
  const song = { ...currSong }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!playerRef.current || !isPlaying) return

      const currentTime = playerRef.current.getCurrentTime?.()
      const totalTime = playerRef.current.getDuration?.()
      //   console.log('totalTime: ',totalTime)
      if (typeof currentTime === 'number' && typeof totalTime === 'number') {
        setProgress(currentTime)
        setDuration(totalTime)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [song, isPlaying, volume])

  //////////////////////////////////////////////////////
  // global shuffle (does not cancel on playlist change)
  useEffect(() => {
    if (!currStation) return

    setOriginalOrder(currStation.songs)
    
    if (isShuffle) {
      // When shuffle is ON, set shuffledOrder
      const shuffled = shuffleArray(currStation.songs)
      setShuffledOrder(shuffled)
    } else {
      // When shuffle is OFF, clear shuffledOrder
      setShuffledOrder([])
    }
  }, [currStation, isShuffle])
  
  // shuffle
  // useEffect(() => {
  //   if (currStation === null) return

  //   setOriginalOrder(currStation.songs)
  //   setIsShuffle(false)
  // }, [currStation])
  //////////////////////////////////////////////////////

  useEffect(() => {
    // if (currSong && isPlaying) {
    //   audioRef.current.src = currSong.url
    //   audioRef.current.play()
    // }
  }, [currSong])

  function onTogglePlay() {
    if (isNotAllowed) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
    } else {
      playerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  function onEnd() {
    if (isRepeat && playerRef.current) {
      playerRef.current.seekTo(0)
      playerRef.current.playVideo()
    } else {
      onNextSong()
    }
  }

  function onNextSong() {
    if (isNotAllowed) return

    const songs = isShuffle ? shuffledOrder : originalOrder

    if (!songs.length || !currSong.id) return

    const currIdx = songs.findIndex((song) => song.id === currSong?.id)
    const nextIdx = (currIdx + 1) % songs.length
    const nextTrack = songs[nextIdx]

    nextSong(nextTrack)
  }

  function onPrevSong() {
    if (isNotAllowed) return

    const currentTime = playerRef.current?.getCurrentTime?.()

    if (typeof currentTime === 'number') {
      if (currentTime > 2) {
        playerRef.current.seekTo(0)
      } else {
        const songs = isShuffle ? shuffledOrder : originalOrder

        if (!songs.length || !currSong.id) return

        const currIdx = songs.findIndex((song) => song.id === currSong?.id)
        if (currIdx === -1) return

        const prevIdx = (currIdx - 1 + songs.length) % songs.length
        const prevTrack = songs[prevIdx]

        prevSong(prevTrack)
      }
    }
  }

  function onShuffle() {
    if (isNotAllowed) return

    const newIsShuffle = !isShuffle
    setIsShuffle(newIsShuffle)

    if (!newIsShuffle) return

    if (newIsShuffle) {
      // Generate a new shuffled list
      const shuffledSongs = shuffleArray(currStation.songs)
      setShuffledOrder(shuffledSongs)
    
    } else {
      setShuffledOrder([]) // clear shuffle
    }
  }

  function shuffleArray(array) {
    const shuffled = [...array] // create a shallow copy to avoid mutating the original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  function onRepeat() {
    if (isNotAllowed) return
    setIsRepeat(!isRepeat)
  }

  function handleClickSeek(ev) {
    const rect = ev.currentTarget.getBoundingClientRect()
    const clickX = ev.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration

    playerRef.current?.seekTo(newTime, true)
    setProgress(newTime)
  }

  return (
    <section className="track-controls-container">
      <div className="track-actions">
        <SetTrackBtn className={`shuffle ${isNotAllowedCN} ${shuffleActive}`} onClick={onShuffle} title="Shuffle"/>

        <SetTrackBtn className={`prev-song ${isNotAllowedCN}`} onClick={onPrevSong} dis={!song} title="Preview song"/>

        <PlayBtn onToggle={onTogglePlay} isPlaying={isPlaying} className={`${isPlay} ${isNotAllowedCN}`} />

        <SetTrackBtn className={`next-song ${isNotAllowedCN}`} onClick={onNextSong} title="Next song" dis={!song} />
        <SetTrackBtn className={`repeat ${isNotAllowedCN} ${repeatActive}`} onClick={onRepeat} title="Repeat" dis={!song} />
      </div>

      <TrackSeek
        progress={progress}
        duration={duration}
        handleClickSeek={handleClickSeek}
        onSeek={(newTime) => {
          playerRef.current.seekTo(newTime, true)
          setProgress(newTime)
        }}
        isNotAllowed={isNotAllowedCN}
      />

      <span className="react-youtube">
        <ReactYouTube
          key={song.id}
          videoId={song.id}
          volume={volume}
          playerRef={playerRef}
          onEnd={onEnd}
        />
      </span>
    </section>
  )
}
