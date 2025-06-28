import { loadFromStorage, saveToStorage } from './util.service'

const BASE_LYRICS_API = 'https://api.lyrics.ovh/v1'

// Enable or disable CORS proxy for local dev only
const USE_CORS_PROXY = true // set to false for production
const CORS_PROXY = 'https://corsproxy.io/?'

const LYRICS_CACHE_KEY = 'lyricsCacheDB'
const lyricsCache = loadFromStorage(LYRICS_CACHE_KEY) || {}

export async function fetchLyrics(song) {
    const artist = song.artist
    const title = song.title

    console.log('Artist:', artist)
    console.log('Title:', title)

    if (!artist || !title) return null

    const cacheKey = song.id || `${title}|${artist}`
    if (lyricsCache[cacheKey]) {
        return lyricsCache[cacheKey]
    }

    const url = `${BASE_LYRICS_API}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    const fetchUrl = USE_CORS_PROXY ? CORS_PROXY + encodeURIComponent(url) : url

    try {
        const res = await fetch(fetchUrl)
        console.log(res)
        const data = await res.json()
        const lyrics = data.lyrics || null

        if (lyrics) {
            lyricsCache[cacheKey] = lyrics
            saveToStorage(LYRICS_CACHE_KEY, lyricsCache)
        }
        // console.log(data.lyrics)
        return data.lyrics || null
    } catch (err) {
        console.error('Lyrics fetch error:', err)
        return null
    }
}


export function parseArtistAndTitle(fullTitle) {
    const cleaned = fullTitle.replace(/["“”]/g, '') 
    const match = cleaned.match(/^(.+?)\s*[–-]\s*(.+)/)

    if (match) {
        return {
            artist: match[1].trim(),
            title: match[2].trim()
        }
    } else {
        return {
            artist: '',
            title: cleaned.trim()
        }
    }
}

if (import.meta.env.DEV) {
    window._fetchLyrics = fetchLyrics
    window._parseSong = parseArtistAndTitle
}
