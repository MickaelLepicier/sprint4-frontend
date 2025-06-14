const BASE_LYRICS_API = 'https://api.lyrics.ovh/v1'

// Enable or disable CORS proxy for local dev only
const USE_CORS_PROXY = true // set to false for production
const CORS_PROXY = 'https://corsproxy.io/?'

// export async function fetchLyrics(song, timeoutMs = 8000) {
//     const artist = song.artist
//     const title = song.title
//     if (!artist || !title) return null

//     const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
//     const fetchUrl = 'https://corsproxy.io/?' + encodeURIComponent(url)

//     try {
//         const controller = new AbortController()
//         const id = setTimeout(() => controller.abort(), timeoutMs)
//         const res = await fetch(fetchUrl, { signal: controller.signal })
//         clearTimeout(id)
//         const data = await res.json()
//         return data.lyrics || null
//     } catch (err) {
//         if (err.name === 'AbortError') {
//             console.error('Lyrics fetch timed out!')
//             return null 
//         }
//         console.error('Lyrics fetch error:', err)
//         return null
//     }
// }

export async function fetchLyrics(song) {
    const artist = song.artist
    const title = song.title

    console.log('Artist:', artist)
    console.log('Title:', title)

    if (!artist || !title) return null

    const url = `${BASE_LYRICS_API}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    const fetchUrl = USE_CORS_PROXY ? CORS_PROXY + encodeURIComponent(url) : url

    try {
        const res = await fetch(fetchUrl)
        console.log(res)
        const data = await res.json()
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
