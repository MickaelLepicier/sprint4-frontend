import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useLyricsColors } from '../hooks/useLyricsColors'
import { fetchLyrics } from '../services/lyrics.service'

export function LyricsPanel() {
  const currentSong = useSelector(state => state.stationModule.currentSong)
  const lyricsCache = useSelector(state => state.stationModule.lyricsCache)
  const dispatch = useDispatch()

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
    const cacheKey = currentSong.id || `${currentSong.title}|${currentSong.artist}`

    if (lyricsCache[cacheKey]) {
      setLyrics(lyricsCache[cacheKey])
      setStatus('success')
    } else {
      fetchLyricsFromApi(currentSong, cacheKey)
    }
  }, [currentSong, lyricsCache])

  async function fetchLyricsFromApi(song, cacheKey) {
    try {
      const fetchedLyrics = await fetchLyrics(song)
      if (fetchedLyrics) {
        setLyrics(fetchedLyrics)
        setStatus('success')
        dispatch({ type: 'SET_LYRICS_CACHE', cacheKey, lyrics: fetchedLyrics })
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