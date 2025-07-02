import { loadFromStorage, saveToStorage } from './util.service'
import { httpService } from './http.service'

const LYRICS_CACHE_KEY = 'lyricsCacheDB'
const lyricsCache = loadFromStorage(LYRICS_CACHE_KEY) || {}

export async function fetchLyrics(song) {
    const artist = song.artist
    const title = song.title
    if (!artist || !title) return null

    const cacheKey = song.id || `${title}|${artist}`

    if (lyricsCache[cacheKey]) {
        return lyricsCache[cacheKey]
    }

    try {
        const data = await httpService.get('lyrics', { artist, title })
        const lyrics = data.lyrics || null

        if (lyrics) {
            lyricsCache[cacheKey] = lyrics
            saveToStorage(LYRICS_CACHE_KEY, lyricsCache)
        }
        return lyrics
    } catch (err) {
        console.error('Lyrics fetch error:', err)
        return null
    }
}
