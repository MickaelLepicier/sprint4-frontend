import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useLyricsColors } from '../hooks/useLyricsColors'
import { fetchLyrics } from '../services/lyrics.service'

export function LyricsPanel() {
  const currentSong = useSelector(state => state.stationModule.currentSong)

  const imgUrl = currentSong?.imgUrl
  const { background, text: color } = useLyricsColors(imgUrl)

  const [lyrics, setLyrics] = useState('')
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error' | 'no-song'

  const messages = {
    loading: 'Loading lyrics...',
    error: `Couldn't load the lyrics for this song. Try again later.`,
    'no-song': 'No song is currently playing'
  }
 
  useEffect(() => {
    if (!currentSong || !currentSong.artist || !currentSong.title) {
      setStatus('no-song')
      setLyrics('')
      return
    }

    setStatus('loading')
    fetchLyricsFromApi(currentSong)
  }, [currentSong])

  async function fetchLyricsFromApi(song) {
    try {
      const fetchedLyrics = await fetchLyrics(song)
      if (fetchedLyrics) {
        setLyrics(fetchedLyrics)
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const isMessage = status !== 'success'

  return (
    <section 
      className={`lyrics-panel ${isMessage ? 'message-mode' : ''}`}
      style={{
        background: isMessage ? '#333333' : background,
        color: isMessage ? '#fff' : color
      }}
    >
      <div className="lyrics-content">
        <pre>
          {isMessage ? messages[status] ?? '' : lyrics}
        </pre>
      </div>
    </section>
  )
}