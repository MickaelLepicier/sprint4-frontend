import { httpService } from '../http.service'
import { loadFromStorage, makeId, saveToStorage, cleanTitle } from '../util.service'

import axios from 'axios'
import { parse, toSeconds } from 'iso8601-duration'

const BASE_URL = 'station/'

const SIDEBAR_CACHE_KEY = 'sideBarCacheDB'
const sideBarCache = loadFromStorage(SIDEBAR_CACHE_KEY) || {}

const HEADER_SEARCH_KEY = 'headerCacheDB'
const headerCache = loadFromStorage(HEADER_SEARCH_KEY) || {}

const GENRE_SEARCH_KEY = 'genreCacheDB'
const genreCache = loadFromStorage(GENRE_SEARCH_KEY) || {}

const RIGGED_MODE = true

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// const YT_API_KEY = import.meta.env.VITE_YT_API_KEY
const YT_API_KEYS = (import.meta.env.VITE_YT_API_KEYS || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean)

let apiKeyIdx = 0

function getCurrentApiKey() {
    return YT_API_KEYS[apiKeyIdx]
}

function advanceApiKey() {
    apiKeyIdx = (apiKeyIdx + 1) % YT_API_KEYS.length
    return getCurrentApiKey()
}

async function withApiKeyRetry(fn, maxTries = YT_API_KEYS.length) {
  let tries = 0
  let lastErr
  while (tries < maxTries) {
    try {
      return await fn(getCurrentApiKey())
    } catch (err) {
      // Retry on 403 Forbidden (quota/dead key)
      if (err.response && err.response.status === 403) {
        advanceApiKey()
        tries++
        lastErr = err
      } else {
        throw err
      }
    }
  }
  throw lastErr
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const stationService = {
  query,
  getById,
  save,
  remove,
  sideBarSearch,
  headerSearch,
  genreSonglistSearch,
  // addStationMsg
  getNextAvailablePlaylistNumber,
  buildNewStationForUser,
  getHomeSearchContent,
  addSongToStation,
  removeSongFromStation,
}

async function query(filterBy = { txt: '' }) {
  return httpService.get(BASE_URL, filterBy)
}

async function getById(stationId) {
  return httpService.get(BASE_URL + stationId)
}

async function remove(stationId) {
  return httpService.delete(BASE_URL + stationId)
}

// async function save(station) {
//   const isUpdate = !!station._id
//   const BASE_URL = isUpdate ? `station/${station._id}` : 'station/'
//   const method = isUpdate ? 'put' : 'post'

//   let stationToSave = {
//     ...station,
//     name: station.name || '',
//     tags: station.tags || [],
//     songs: station.songs || [],
//     msgs: station.msgs || [],
//     likedByUsers: station.likedByUsers || [],
//     createdAt: station.createdAt || Date.now(),
//     createdBy: station.createdBy,
//     imgUrl: station.imgUrl,
//     origId: station.origId || '',
//   }

//   if (isUpdate) {
//     delete stationToSave._id
//   }

//   return httpService[method](BASE_URL, stationToSave)
// }

async function save(station) {
  const isValidObjectId = id => typeof id === 'string' && id.length === 24 && /^[a-f\d]{24}$/i.test(id)

  let stationToSave = {
    ...station,
    name: station.name || '',
    tags: station.tags || [],
    songs: station.songs || [],
    msgs: station.msgs || [],
    likedByUsers: station.likedByUsers || [],
    createdAt: station.createdAt || Date.now(),
    origId: station._id || '',
  }

  if (isValidObjectId(station._id)) {
    return await httpService.put(`station/${station._id}`, stationToSave)
  } else {
    delete stationToSave._id
    return await httpService.post('station', stationToSave)
  }
}

async function sideBarSearch(query) {
    const searchWord = query.trim().toLowerCase()

    if (sideBarCache[searchWord]?.length) {
        return Promise.resolve(sideBarCache[searchWord])
    }

    return withApiKeyRetry(async (apiKey) => {
        const searchResults = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 10,
                key: apiKey, 
            },
        })

        const videoIds = searchResults.data.items.map(item => item.id.videoId).join(',')
        if (!videoIds) return []

        const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: videoIds,
                key: apiKey,
            },
        })

        const finalResults = detailsRes.data.items.map(item => ({
            id: item.id,
            url: item.id,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            description: item.snippet.description,
            artist: item.snippet.channelTitle,
            addedAt: new Date(item.snippet.publishedAt).getTime(),
            imgUrl: item.snippet.thumbnails.default.url,
            duration: isoDurationToSeconds(item.contentDetails.duration),
        }))
        sideBarCache[searchWord] = finalResults
        saveToStorage(SIDEBAR_CACHE_KEY, sideBarCache)
        console.log('finalResults:', finalResults)
        return finalResults
    })
}

// async function headerSearch(query, numResults = 5) {
//     const searchWord = query.trim().toLowerCase()

//     // Rigged demo
//     const isLinkinPark = RIGGED_MODE && /link\s*in?\s*park|linkpark|linkinpark/i.test(searchWord)
//     if (isLinkinPark) {
//         const riggedStations = createRiggedLinkinParkStation(query)
//         headerCache[searchWord] = riggedStations
//         saveToStorage(HEADER_SEARCH_KEY, headerCache)
//         return Promise.resolve(riggedStations)
//     }
    
//     if (headerCache[searchWord]?.length) {
//         return Promise.resolve(headerCache[searchWord])
//     }

//     return withApiKeyRetry(async (apiKey) => {
//         const searchResults = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//             params: {
//                 part: 'snippet',
//                 q: query,
//                 type: 'video',
//                 maxResults: numResults,
//                 key: apiKey, // swapped here
//             },
//         })

//         const baseVideos = searchResults.data.items

//         const artistStations = await Promise.all(
//             baseVideos.map(async (video, idx) => {
//                 const artist = video.snippet.channelTitle

//                 const artistRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//                     params: {
//                         part: 'snippet',
//                         q: artist,
//                         type: 'video',
//                         maxResults: 10,
//                         key: apiKey, // swapped here
//                     },
//                 })

//                 const songs = artistRes.data.items
//                     .filter(item => item.id?.videoId)
//                     .map((item, i) => ({
//                         id: item.id.videoId,
//                         videoId: item.id.videoId,
//                         title: item.snippet.title,
//                         artist: item.snippet.channelTitle,
//                         imgUrl: item.snippet.thumbnails?.medium?.url || '',
//                         addedBy: `u10${i}`,
//                         likedBy: [`u20${i}`],
//                         addedAt: Date.now() - (i + 1) * 1000000,
//                     }))

//                 const videoIds = songs.map(song => song.videoId).join(',')
//                 if (videoIds) {
//                     const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
//                         params: {
//                             part: 'contentDetails',
//                             id: videoIds,
//                             key: apiKey, // swapped here
//                         },
//                     })

//                     const durationsMap = {}
//                     detailsRes.data.items.forEach(item => {
//                         durationsMap[item.id] = isoDurationToSeconds(item.contentDetails.duration)
//                     })

//                     songs.forEach(song => {
//                         song.duration = durationsMap[song.videoId] || 0
//                     })
//                 }

//                 const station = _createEmptyStation()
//                 station._id = video.id?.videoId || `fallback-${idx}`
//                 station.name = artist
//                 station.imgUrl = video.snippet.thumbnails?.medium?.url || ''
//                 station.tags = [query]
//                 station.createdBy.fullname = artist
//                 station.songs = songs
//                 station.msgs = [
//                     { id: `m${idx}1`, from: 'u201', txt: 'Great vibes!' },
//                     { id: `m${idx}2`, from: 'u202', txt: 'Love it!' },
//                 ]

//                 return station
//             })
//         )

//         headerCache[searchWord] = artistStations
//         saveToStorage(HEADER_SEARCH_KEY, headerCache)

//         return artistStations
//     })
// }

async function genreSonglistSearch(genre, numResults = 5) {
  const searchWord = genre.trim().toLowerCase()

  if (genreCache[searchWord]?.length) {
    return Promise.resolve(genreCache[searchWord])
  }

  return withApiKeyRetry(async (apiKey) => {
    const songlistSearchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${genre} music new playlist`,
        type: 'playlist',
        maxResults: numResults,
        key: apiKey,
      },
    })

    const songlists = songlistSearchRes.data.items

    const stations = await Promise.all(
      songlists.map(async (songlist, idx) => {
        const songlistId = songlist.id.playlistId

        const itemsRes = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
          params: {
            part: 'snippet',
            playlistId: songlistId,
            maxResults: 10,
            key: apiKey,
          },
        })

        const songs = itemsRes.data.items
          .filter(item => item.snippet?.resourceId?.videoId)
          .map((item, i) => ({
            id: item.snippet.resourceId.videoId,
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            imgUrl: item.snippet.thumbnails?.medium?.url || '',
            addedBy: `u10${i}`,
            likedBy: [`u20${i}`],
            addedAt: Date.now() - (i + 1) * 1000000,
          }))

        const videoIds = songs.map(song => song.videoId).join(',')
        if (videoIds) {
          const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
              part: 'contentDetails',
              id: videoIds,
              key: apiKey,
            },
          })

          const durationsMap = {}
          detailsRes.data.items.forEach(item => {
            durationsMap[item.id] = isoDurationToSeconds(item.contentDetails.duration)
          })

          songs.forEach(song => {
            song.duration = durationsMap[song.videoId] || 0
          })
        }

        const station = _createEmptyStation()
        const imgUrl = songs.find(song => song.imgUrl)?.imgUrl || ''

        station._id = songlistId
        station.name = songlist.snippet.title
        station.imgUrl = imgUrl
        station.tags = [genre]
        station.createdBy.fullname = songlist.snippet.channelTitle
        station.songs = songs
        station.msgs = [
          { id: `m${idx}1`, from: 'u201', txt: '🔥 Love this genre mix!' },
          { id: `m${idx}2`, from: 'u202', txt: 'Perfect for the vibe' },
        ]
        return station
      })
    )
    genreCache[searchWord] = stations
    saveToStorage(GENRE_SEARCH_KEY, genreCache)
    return stations
  })
}

function buildNewStationForUser(user, nextNum) {
  const emptyStation = _createEmptyStation()

  const newUserStation = {
    ...emptyStation,
    name: `My Playlist #${nextNum}`,
    createdBy: {
      _id: user._id,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
    },
    createdAt: Date.now(),
  }

  return newUserStation
}

export function getNextAvailablePlaylistNumber(stations, userId) {
  const usedNums = stations
    .filter(st => st.createdBy?._id === userId)
    .map(st => {
      const match = st.name?.match(/^My Playlist #(\d+)$/)
      return match ? +match[1] : null
    })
    .filter(num => num !== null)
    .sort((a, b) => a - b)

  let nextNum = 1
  for (const num of usedNums) {
    if (num === nextNum) {
      nextNum++
    } else {
      break
    }
  }

  return nextNum
}

async function getHomeSearchContent(query = 'playlist 2025') {
  const [genreResults, headerResults] = await Promise.all([
    stationService.genreSonglistSearch(query, 12),
    stationService.headerSearch(query, 12),
  ])

  return [...genreResults, ...headerResults]
}

function isoDurationToSeconds(iso) {
  const durationObj = parse(iso)
  const seconds = toSeconds(durationObj)
  return seconds
}

async function addSongToStation(stationId, song) {
  try {
    const station = await getById(stationId)
    station.songs.push(song)
    return await save(station)
  } catch (error) {
    throw error
  }
}

async function removeSongFromStation(stationId, songId) {
  try {
    const station = await getById(stationId)
    station.songs = station.songs.filter(song => song.id !== songId)
    return await save(station)
  } catch (error) {
    throw error
  }
}

function _createEmptyStation() {
  return {
    // _id: makeId(), // empty stations don't make id!! save() does that
    name: '',
    imgUrl: '',
    tags: [],
    createdBy: {
      _id: 'userId',
      fullname: '',
      imgUrl: '',
    },
    likedByUsers: [],
    songs: [],
    msgs: [],
  }
}

// async function addStationMsg(stationId, txt)   {
//     const savedMsg = await httpService.post(`station/${stationId}/msg`, { txt })
//     return savedMsg
// }

async function headerSearch(query, numResults = 5) {
    const searchWord = query.trim().toLowerCase()
    const isLinkinPark = RIGGED_MODE && /link\s*in?\s*park|linkpark|linkinpark/i.test(searchWord)

    console.log('IS LINKIN PARK ',  isLinkinPark)
    console.log("SEARCH WORD!!!!!!", searchWord, searchWord.length)

    if (headerCache[searchWord]?.length) {
        return Promise.resolve(headerCache[searchWord])
    }

    // Fetch the normal results for *every* query
    const artistStations = await withApiKeyRetry(async (apiKey) => {
        const searchResults = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: numResults,
                key: apiKey,
            },
        })

        const baseVideos = searchResults.data.items

        return Promise.all(
            baseVideos.map(async (video, idx) => {
                const artist = video.snippet.channelTitle

                const artistRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        q: artist,
                        type: 'video',
                        maxResults: 10,
                        key: apiKey,
                    },
                })

                const songs = artistRes.data.items
                    .filter(item => item.id?.videoId)
                    .map((item, i) => ({
                        id: item.id.videoId,
                        videoId: item.id.videoId,
                        title: item.snippet.title,
                        artist: item.snippet.channelTitle,
                        imgUrl: item.snippet.thumbnails?.medium?.url || '',
                        addedBy: `u10${i}`,
                        likedBy: [`u20${i}`],
                        addedAt: Date.now() - (i + 1) * 1000000,
                    }))

                const videoIds = songs.map(song => song.videoId).join(',')
                if (videoIds) {
                    const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                        params: {
                            part: 'contentDetails',
                            id: videoIds,
                            key: apiKey,
                        },
                    })

                    const durationsMap = {}
                    detailsRes.data.items.forEach(item => {
                        durationsMap[item.id] = isoDurationToSeconds(item.contentDetails.duration)
                    })

                    songs.forEach(song => {
                        song.duration = durationsMap[song.videoId] || 0
                    })
                }

                const station = _createEmptyStation()
                station._id = video.id?.videoId || `fallback-${idx}`
                station.name = artist
                station.imgUrl = video.snippet.thumbnails?.medium?.url || ''
                station.tags = [query]
                station.createdBy.fullname = artist
                station.songs = songs
                station.msgs = [
                    { id: `m${idx}1`, from: 'u201', txt: 'Great vibes!' },
                    { id: `m${idx}2`, from: 'u202', txt: 'Love it!' },
                ]
                return station
            })
        )
    })

    // Only rig for linkin park!
    if (isLinkinPark && artistStations.length) {
        artistStations[0] = createRiggedLinkinParkStation(query)[0]
    }

    headerCache[searchWord] = artistStations
    saveToStorage(HEADER_SEARCH_KEY, headerCache)
    return Promise.resolve(artistStations)
}



function createRiggedLinkinParkStation(query = "linkin park") {
    const now = Date.now()
    const songs = [
        {
            id: "eVTXPUF4Oz4",
            title: "In the End",
            artist: "Linkin Park",
            album: "Hybrid Theory",
            imgUrl: "https://i.ytimg.com/vi/eVTXPUF4Oz4/mqdefault.jpg",
            duration: 216
        },
        {
            id: "kXYiU_JCYtU",
            title: "Numb",
            artist: "Linkin Park",
            album: "Meteora",
            imgUrl: "https://i.ytimg.com/vi/kXYiU_JCYtU/mqdefault.jpg",
            duration: 185
        },
        {
            id: "Gd9OhYroLN0",
            title: "Somewhere I Belong",
            artist: "Linkin Park",
            album: "Meteora",
            imgUrl: "https://i.ytimg.com/vi/Gd9OhYroLN0/mqdefault.jpg",
            duration: 217
        },
        {
            id: "8sgycukafqQ",
            title: "What I've Done",
            artist: "Linkin Park",
            album: "Minutes to Midnight",
            imgUrl: "https://i.ytimg.com/vi/8sgycukafqQ/mqdefault.jpg",
            duration: 207
        },
        {
            id: "LYU-8IFcDPw",
            title: "Faint",
            artist: "Linkin Park",
            album: "Meteora",
            imgUrl: "https://i.ytimg.com/vi/LYU-8IFcDPw/mqdefault.jpg",
            duration: 162
        },
        {
            id: "4qlCC1GOwFw",
            title: "Breaking the Habit",
            artist: "Linkin Park",
            album: "Meteora",
            imgUrl: "https://i.ytimg.com/vi/4qlCC1GOwFw/mqdefault.jpg",
            duration: 208
        },
        {
            id: "vjVkXlxsO8Q",
            title: "Papercut",
            artist: "Linkin Park",
            album: "Hybrid Theory",
            imgUrl: "https://i.ytimg.com/vi/vjVkXlxsO8Q/mqdefault.jpg",
            duration: 185
        },
        {
            id: "Gd9OhYroLN0",
            title: "Crawling",
            artist: "Linkin Park",
            album: "Hybrid Theory",
            imgUrl: "https://i.ytimg.com/vi/Gd9OhYroLN0/mqdefault.jpg",
            duration: 209
        },
        {
            id: "ScNNfyq3d_w",
            title: "Waiting for the End",
            artist: "Linkin Park",
            album: "A Thousand Suns",
            imgUrl: "https://i.ytimg.com/vi/ScNNfyq3d_w/mqdefault.jpg",
            duration: 233
        },
        {
            id: "zsCD5XCu6CM",
            title: "Bleed It Out",
            artist: "Linkin Park",
            album: "Minutes to Midnight",
            imgUrl: "https://i.ytimg.com/vi/zsCD5XCu6CM/mqdefault.jpg",
            duration: 167
        }
    ]

    // You can add more songs as needed

    const station = _createEmptyStation()
    station._id = songs[0].id 
    station.name = "Linkin Park"
    station.imgUrl = "https://i.ytimg.com/vi/SRXH9AbT280/mqdefault.jpg" // Nice LP pic
    station.tags = [query]
    station.createdBy = { fullname: "Linkin Park" }
    station.songs = songs
    station.msgs = [
        { id: "m1", from: "u201", txt: "Great vibes!" },
        { id: "m2", from: "u202", txt: "Love it!" }
    ]
    return [station]
}
