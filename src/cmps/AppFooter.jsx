import { MediaPlayer } from './MediaPlayer'

import { useSelector } from 'react-redux'

import playBtn from '../assets/icons/media-player/play_small.svg'
import pauseBtn from '../assets/icons/media-player/pause_small.svg'


export function AppFooter() {
  const count = useSelector((storeState) => storeState.userModule.count)
  const song = useSelector((storeState) => storeState.stationModule.currentSong) || ''


  function getEmbedUrl(url) {
    if (!url) return
    const match = url.match(/v=([a-zA-Z0-9_-]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : ''
  }






  return (
    <footer className="app-footer full">
      <MediaPlayer />

      {/* <section className="song-player-section">
        <iframe
          width="420"
          height="50"
          src={getEmbedUrl(song.url)}
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </section> */}
    </footer>
  )
}
