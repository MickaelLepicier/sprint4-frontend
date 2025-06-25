import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { cleanTitle } from "../services/util.service";
import { SidebarPlayBtn } from "./Sidebar/SidebarPlayBtn";
import equalizerGif from '/src/assets/img/equalizer.gif'

export function WideStationPreview({ station, goToStation, setImgHover }) {
  const currentStationId = useSelector(state => state.stationModule.currentStation?._id)
  const isPlayingSong = useSelector(state => state.stationModule.isPlaying) || null
  const isPlaying = station?._id === currentStationId
  
  const wideStationRef = useRef(null)
  const [isLargePlayIcon, setisLargePlayIcon] = useState(false)

  useEffect(() => {
      if (!wideStationRef.current) return
      const obs = new window.ResizeObserver(([entry]) => {
          setisLargePlayIcon(entry.contentRect.height >= 63.99)
      })
      obs.observe(wideStationRef.current)
      return () => obs.disconnect()
  }, [])

  return (
    <div 
      ref={wideStationRef}
      className="wide-station-preview" 
      role="listitem" 
      onMouseEnter={() => setImgHover(station?.imgUrl)}
      // onMouseEnter={() => setImgHover('https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/artistmix/2vPzfdWIYB3zCD8qEIvMM0/en')}
      onMouseLeave={() => setImgHover(null)}  
    >
      {/* <button className="play-btn" aria-label={`Play ${station.name} by ${station.artist}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.05 3.606l13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
        </svg>
      </button> */}
      <div className="img-container">
        <img src={station.imgUrl} alt={station.name} draggable="false" loading="lazy" />
      </div>

      <div className="info" onClick={() => goToStation(station)}>
        <div className="station-name-wrapper" >
          <p className="station-name">{cleanTitle(station.name)}</p>
          {station.artist && <p className="station-artist">{station.artist}</p>}
        </div>

        <div className="play-btn-container encore-bright-accent-set">
          <div className="box-shadow-wrapper">
            <SidebarPlayBtn station={station} isLargePlayIcon={isLargePlayIcon} />
          </div>
        </div>

        {isPlaying && isPlayingSong && (
          <div className="gif-container">
            <img className="equalizer-gif" src={equalizerGif} />
          </div>
        )}
      </div>
    </div>
  )
}
