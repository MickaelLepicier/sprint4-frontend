import { ReactYouTube } from './ReactYoutube.jsx'

import play from '../assets/icons/media-player/play_small.svg'
import pause from '../assets/icons/media-player/pause_small.svg'
import prev from '../assets/icons/media-player/prev_song.svg'
import next from '../assets/icons/media-player/next_song.svg'

import volumeLow from '../assets/icons/media-player/volume_low.svg'
import volumeMedium from '../assets/icons/media-player/volume_medium.svg'
import volumeHigh from '../assets/icons/media-player/volume_high.svg'
import volumeMute from '../assets/icons/media-player/volume_mute.svg'

import shuffle from '../assets/icons/media-player/shuffle.svg'
import repeat from '../assets/icons/media-player/repeat.svg'

import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { nextSong, prevSong, setIsPlaying } from '../store/station/station.actions.js'

export function MediaPlayer() {
  const isPlaying = useSelector((storeState) => storeState.stationModule.isPlaying)
  const currentSong = useSelector((storeState) => storeState.stationModule.currentSong) || ''


  const videoId = 'SRXH9AbT280' // Extract from YouTube URL

  const playerRef = useRef(null)

  // track time
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  // volume
  const [volume, setVolume] = useState(50)
  const [prevVolume, setPrevVolume] = useState(50)

  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

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
  }, [isPlaying])
  // }, [song, isPlaying, volume, songIdx])


  useEffect(() => {
    if (currentSong && isPlaying) {
      audioRef.current.src = currentSong.url
      audioRef.current.play()
    }
  }, [currentSong])

  function setActionIcon(imgSrc, str, func, dis = false) {
    return (
      <button className={`track-action ${str}`} onClick={func} disabled={dis}>
        <img src={imgSrc} alt={str} />
      </button>
    )
  }

  async function togglePlay() {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }

    setIsPlaying()
  }

  function onEnd() {
    nextSong()
  }
  function onNextSong() {
    nextSong()
  }

  function onPrevSong() {
    prevSong()
  }

  function formatTime(sec) {
    const minutes = Math.floor(sec / 60)
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  // *** VOLUME ***

  function handleVolumeChange(ev) {
    const newVolume = +ev.target.value
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
    }
  }

  function toggleMute() {
    if (volume === 0) {
      setVolume(prevVolume)
      if (playerRef.current) playerRef.current.setVolume(prevVolume)
    } else {
      setPrevVolume(volume)
      setVolume(0)
      if (playerRef.current) playerRef.current.setVolume(0)
    }
  }

  function getVolumeIcon() {
    let imgSrc = volumeHigh

    if (volume === 0) imgSrc = volumeMute
    else if (volume <= 40) imgSrc = volumeLow 
    else if (volume <= 80) imgSrc = volumeMedium

    return <img src={imgSrc} alt='volume icon' />
  }

  return (
    <footer className="media-player-container flex align-center">
      <section> song data</section>

      <section className="track-controls-container">
        <div className="track-actions">
          {setActionIcon(shuffle, 'shuffle')}
          {setActionIcon(prev, 'prev', onPrevSong, !currentSong)}

          {isPlaying ? setActionIcon(pause, 'pause', togglePlay) : setActionIcon(play, 'play', togglePlay)}

          {setActionIcon(next, 'next', onNextSong, !currentSong)}
          {setActionIcon(repeat, 'repeat')}
        </div>

        <div className="track-seek flex">
          <div className="track-time">{formatTime(progress)}</div>
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
            className="track-bar"
            style={{
              '--bar-fill': duration ? `${(progress / duration) * 100}%` : '0%'
            }}
          />
          <div className="track-time">{formatTime(duration)}</div>
        </div>

        <span className="react-youtube">
          <ReactYouTube
            key={videoId} // later on change to song.url
            videoId={videoId} // song.url
            isPlaying={isPlaying}
            // volume={volume}
            volume={50}
            playerRef={playerRef}
            onEnd={onEnd}
          />
        </span>
      </section>

      {/* *** VOLUME *** */}

      <section className="track-options flex">
        
        <button className="track-action" onClick={toggleMute}>
          <span>{getVolumeIcon()}</span>
        </button>

        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="track-bar"
          style={{ '--bar-fill': `${volume}%` }}
        />
      </section>
    </footer>
  )
}
