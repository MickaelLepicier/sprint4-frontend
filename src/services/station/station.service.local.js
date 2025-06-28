import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage,cleanTitle } from '../util.service'
import { initLocalStations } from './station.init'
import { userService } from '../user'


import axios from 'axios'
import { parse, toSeconds } from 'iso8601-duration'

const STORAGE_KEY = 'stationDB'

const SIDEBAR_CACHE_KEY = 'sideBarCacheDB'
const sideBarCache = loadFromStorage(SIDEBAR_CACHE_KEY) || {}

const HEADER_SEARCH_KEY = 'headerCacheDB'
const headerCache = loadFromStorage(HEADER_SEARCH_KEY) || {}

const GENRE_SEARCH_KEY = 'genreCacheDB'
const genreCache = loadFromStorage(GENRE_SEARCH_KEY) || {}

const YT_API_KEY = import.meta.env.VITE_YT_API_KEY

_createDemoStations()

export const stationService = {
  query,
  getById,
  save,
  remove,
  sideBarSearch,
  genreSonglistSearch,
  headerSearch,
  addSongToStation,
  removeSongFromStation,
  buildNewStationForUser,
  getNextAvailablePlaylistNumber,
  getHomeSearchContent,
  getGenreColorByName
  // addCarMsg
}

window.cs = stationService

async function query(filterBy = { txt: '' }) {
  var stations = await storageService.query(STORAGE_KEY)
  
  const { txt, tag, sortField = 'asc', sortDir, onlyLiked } = filterBy
  console.log('filterBy:',filterBy)

  if (txt) {
    const regex = new RegExp(txt, 'i')
    stations = stations.filter(
      station => regex.test(station.name) || station.songs.some(song => regex.test(song.title))
    )
  }

  if (tag) {
    stations = stations.filter(station => station.tags.includes(tag))
  }

  //future adding liked by user sort and filter by liked

  // if (sortField === 'name' || sortField === 'createdBy') {
  if (sortField === 'name') {
    stations.sort((station1, station2) => station1[sortField].localeCompare(station2[sortField]) * +sortDir)
  }

  // stations = stations.map(({ _id, vendor, price, speed, owner }) => ({ _id, vendor, price, speed, owner }))

  return stations
}

function getById(stationId) {
  return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, stationId)
}

// NEW SAVE: keeps all fields (e.g. createdBy) to avoid songlist bugs
async function save(station) {
  let savedStation

  if (station._id) {
    // Check if station exists before updating
    const existingStations = await storageService.query(STORAGE_KEY)
    const exists = existingStations.some(s => s._id === station._id)
    if (exists) {
      const stationToSave = { ...station }
      savedStation = await storageService.put(STORAGE_KEY, stationToSave)
    } else {
      // Treat as new (post), use existing _id if present
      const stationToSave = {
        ...station,
        name: station.name || '',
        tags: station.tags || [],
        songs: station.songs || [],
        msgs: station.msgs || [],
        likedByUsers: station.likedByUsers || [],
        createdAt: station.createdAt || Date.now(),
      }
      savedStation = await storageService.post(STORAGE_KEY, stationToSave)
    }
  } else {
    // No _id at all, always post (create)
    const stationToSave = {
      ...station,
      name: station.name || '',
      tags: station.tags || [],
      songs: station.songs || [],
      msgs: station.msgs || [],
      likedByUsers: station.likedByUsers || [],
      createdAt: station.createdAt || Date.now(),
    }
    savedStation = await storageService.post(STORAGE_KEY, stationToSave)
  }

  return savedStation
}

async function addSongToStation(stationId, song) {
  const station = await getById(stationId)
  station.songs.push(song)
  return await save(station)
}

async function removeSongFromStation(stationId, songId) {
  const station = await getById(stationId)
  station.songs = station.songs.filter(song => song.id !== songId)
  return await save(station)
}

function isoDurationToSeconds(iso) {
  const durationObj = parse(iso)
  const seconds = toSeconds(durationObj)
  return seconds
}

async function getHomeSearchContent(query = 'playlist 2025') {
  const [genreResults, headerResults] = await Promise.all([
    stationService.genreSonglistSearch(query, 12),
    stationService.headerSearch(query, 12),
  ])

  return [...genreResults, ...headerResults]
}

// async function sideBarSearch(query) {
//   const searchWord = query.trim().toLowerCase()

//   if (sideBarCache[searchWord]?.length) {
//     return Promise.resolve(sideBarCache[searchWord])
//   }

//   try {
//     const searchResults = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//       params: {
//         part: 'snippet',
//         q: query,
//         type: 'video',
//         maxResults: 5,
//         key: YT_API_KEY,
//       },
//     })

//     const videoIds = searchResults.data.items.map(item => item.id.videoId).join(',')
//     if (!videoIds) return []

//     const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
//       params: {
//         part: 'snippet,contentDetails,statistics',
//         id: videoIds,
//         key: YT_API_KEY,
//       },
//     })

//     const finalResults = detailsRes.data.items.map(item => ({
//       id: item.id,
//       url: item.id,
//       title: item.snippet.title,
//       description: item.snippet.description,
//       artist: item.snippet.channelTitle,
//       addedAt: new Date(item.snippet.publishedAt).getTime(),
//       imgUrl: item.snippet.thumbnails.default.url,
//       duration: isoDurationToSeconds(item.contentDetails.duration),
//     }))
//     sideBarCache[searchWord] = finalResults
//     saveToStorage(SIDEBAR_CACHE_KEY, sideBarCache)
//     console.log('finalResults:', finalResults)
//     return finalResults
//   } catch (error) {
//     console.log('err:', error)
//     throw error
//   }
// }

// async function headerSearch(query, numResults = 5) {
//   const searchWord = query.trim().toLowerCase()

//   if (headerCache[searchWord]?.length) {
//     return Promise.resolve(headerCache[searchWord])
//   }

//   try {
//     const searchResults = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//       params: {
//         part: 'snippet',
//         q: query,
//         type: 'video',
//         maxResults: numResults,
//         key: YT_API_KEY,
//       },
//     })

//     const baseVideos = searchResults.data.items

//     const artistStations = await Promise.all(
//       baseVideos.map(async (video, idx) => {
//         const artist = video.snippet.channelTitle

//         const artistRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//           params: {
//             part: 'snippet',
//             q: artist,
//             type: 'video',
//             maxResults: 3,
//             key: YT_API_KEY,
//           },
//         })

//         const songs = artistRes.data.items
//           .filter(item => item.id?.videoId)
//           .map((item, i) => ({
//             id: item.id.videoId,
//             videoId: item.id.videoId,
//             title: item.snippet.title,
//             imgUrl: item.snippet.thumbnails?.medium?.url || '',
//             addedBy: `u10${i}`,
//             likedBy: [`u20${i}`],
//             addedAt: Date.now() - (i + 1) * 1000000,
//           }))

//         const videoIds = songs.map(song => song.videoId).join(',')
//         if (videoIds) {
//           const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
//             params: {
//               part: 'contentDetails',
//               id: videoIds,
//               key: YT_API_KEY,
//             },
//           })

//           const durationsMap = {}
//           detailsRes.data.items.forEach(item => {
//             durationsMap[item.id] = isoDurationToSeconds(item.contentDetails.duration)
//           })

//           songs.forEach(song => {
//             song.duration = durationsMap[song.videoId] || 0
//           })
//         }

//         const station = _createEmptyStation()
//         station._id = video.id?.videoId || `fallback-${idx}`
//         station.name = artist
//         station.imgUrl = video.snippet.thumbnails?.medium?.url || ''
//         station.tags = [query]
//         station.createdBy.fullname = artist
//         station.songs = songs
//         station.msgs = [
//           { id: `m${idx}1`, from: 'u201', txt: 'Great vibes!' },
//           { id: `m${idx}2`, from: 'u202', txt: 'Love it!' },
//         ]

//         return station
//       })
//     )

//     headerCache[searchWord] = artistStations
//     saveToStorage(HEADER_SEARCH_KEY, headerCache)

//     return artistStations
//   } catch (error) {
//     console.log('err:', error)
//     throw error
//   }
// }

// async function genreSonglistSearch(genre, numResults = 5) {
//   const searchWord = genre.trim().toLowerCase()

//   if (genreCache[searchWord]?.length) {
//     return Promise.resolve(genreCache[searchWord])
//   }

//   try {
//     const songlistSearchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//       params: {
//         part: 'snippet',
//         q: `${genre} music new playlist`,
//         type: 'playlist',
//         maxResults: numResults,
//         key: YT_API_KEY,
//       },
//     })

//     const songlists = songlistSearchRes.data.items

//     const stations = await Promise.all(
//       songlists.map(async (songlist, idx) => {
//         const songlistId = songlist.id.playlistId

//         const itemsRes = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
//           params: {
//             part: 'snippet',
//             playlistId: songlistId,
//             maxResults: 3,
//             key: YT_API_KEY,
//           },
//         })

//         const songs = itemsRes.data.items
//           .filter(item => item.snippet?.resourceId?.videoId)
//           .map((item, i) => ({
//             id: item.snippet.resourceId.videoId,
//             videoId: item.snippet.resourceId.videoId,
//             title: item.snippet.title,
//             imgUrl: item.snippet.thumbnails?.medium?.url || '',
//             addedBy: `u10${i}`,
//             likedBy: [`u20${i}`],
//             addedAt: Date.now() - (i + 1) * 1000000,
//           }))

//         const videoIds = songs.map(song => song.videoId).join(',')
//         if (videoIds) {
//           const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
//             params: {
//               part: 'contentDetails',
//               id: videoIds,
//               key: YT_API_KEY,
//             },
//           })

//           const durationsMap = {}
//           detailsRes.data.items.forEach(item => {
//             durationsMap[item.id] = isoDurationToSeconds(item.contentDetails.duration)
//           })

//           songs.forEach(song => {
//             song.duration = durationsMap[song.videoId] || 0
//           })
//         }

//         const station = _createEmptyStation()
//         const imgUrl = songs.find(song => song.imgUrl)?.imgUrl || ''

//         station._id = songlistId
//         station.name = songlist.snippet.title
//         station.imgUrl = imgUrl
//         station.tags = [genre]
//         station.createdBy.fullname = songlist.snippet.channelTitle
//         station.songs = songs
//         station.msgs = [
//           { id: `m${idx}1`, from: 'u201', txt: '🔥 Love this genre mix!' },
//           { id: `m${idx}2`, from: 'u202', txt: 'Perfect for the vibe' },
//         ]
//         return station
//       })
//     )
//     genreCache[searchWord] = stations
//     saveToStorage(GENRE_SEARCH_KEY, genreCache)
//     return stations
//   } catch (err) {
//     console.log('genreSonglistSearch error:', err)
//     throw err
//   }
// }

async function sideBarSearch(query) {
    const searchWord = query.trim().toLowerCase()

    if (sideBarCache[searchWord]?.length) {
        return Promise.resolve(sideBarCache[searchWord])
    }

    try {
        const searchResults = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 5,
                key: YT_API_KEY,
            },
        })

        const videoIds = searchResults.data.items.map(item => item.id.videoId).join(',')
        if (!videoIds) return []

        const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: videoIds,
                key: YT_API_KEY,
            },
        })

        const finalResults = detailsRes.data.items.map(item => {
            const { artist, title } = splitTitleAndArtist(item.snippet.title)

            return {
                id: item.id,
                url: item.id,
                title,
                artist: artist || item.snippet.channelTitle,
                description: item.snippet.description,
                addedAt: new Date(item.snippet.publishedAt).getTime(),
                imgUrl: item.snippet.thumbnails.default.url,
                duration: isoDurationToSeconds(item.contentDetails.duration),
            }
        })

        sideBarCache[searchWord] = finalResults
        saveToStorage(SIDEBAR_CACHE_KEY, sideBarCache)
        console.log('finalResults:', finalResults)
        return finalResults
    } catch (error) {
        console.log('err:', error)
        throw error
    }
}

async function headerSearch(query, numResults = 5) {
    const searchWord = query.trim().toLowerCase()

    if (headerCache[searchWord]?.length) {
        return Promise.resolve(headerCache[searchWord])
    }

    try {
        const searchResults = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: numResults,
                key: YT_API_KEY,
            },
        })

        const baseVideos = searchResults.data.items

        const artistStations = await Promise.all(
            baseVideos.map(async (video, idx) => {
                const artist = video.snippet.channelTitle

                const artistRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        q: artist,
                        type: 'video',
                        maxResults: numResults,
                        key: YT_API_KEY,
                    },
                })

                const songs = artistRes.data.items
                    .filter(item => item.id?.videoId)
                    .map((item, i) => {
                        const videoId = item.id.videoId
                        const fullTitle = item.snippet.title
                        const imgUrl = item.snippet.thumbnails?.medium?.url || ''
                        const { artist, title } = splitTitleAndArtist(fullTitle)

                        return {
                            id: videoId,
                            videoId,
                            title,
                            artist,
                            imgUrl,
                            addedBy: `u10${i}`,
                            likedBy: [`u20${i}`],
                            addedAt: Date.now() - (i + 1) * 1000000,
                        }
                    })

                const videoIds = songs.map(song => song.videoId).join(',')
                if (videoIds) {
                    const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                        params: {
                            part: 'contentDetails',
                            id: videoIds,
                            key: YT_API_KEY,
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

        headerCache[searchWord] = artistStations
        saveToStorage(HEADER_SEARCH_KEY, headerCache)

        return artistStations
    } catch (error) {
        console.log('err:', error)
        throw error
    }
}

async function genreSonglistSearch(genre, numResults = 5) {
    const searchWord = genre.trim().toLowerCase()

    if (genreCache[searchWord]?.length) {
        return Promise.resolve(genreCache[searchWord])
    }

    try {
        const songlistSearchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: `${genre} music new playlist`,
                type: 'playlist',
                maxResults: numResults,
                key: YT_API_KEY,
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
                        maxResults: 3,
                        key: YT_API_KEY,
                    },
                })

                const songs = itemsRes.data.items
                    .filter(item => item.snippet?.resourceId?.videoId)
                    .map((item, i) => {
                        const videoId = item.snippet.resourceId.videoId
                        const fullTitle = item.snippet.title
                        const imgUrl = item.snippet.thumbnails?.medium?.url || ''
                        const { artist, title } = splitTitleAndArtist(fullTitle)

                        return {
                            id: videoId,
                            videoId,
                            title,
                            artist,
                            imgUrl,
                            addedBy: `u10${i}`,
                            likedBy: [`u20${i}`],
                            addedAt: Date.now() - (i + 1) * 1000000,
                        }
                    })

                const videoIds = songs.map(song => song.videoId).join(',')
                if (videoIds) {
                    const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                        params: {
                            part: 'contentDetails',
                            id: videoIds,
                            key: YT_API_KEY,
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
    } catch (err) {
        console.log('genreSonglistSearch error:', err)
        throw err
    }
}

function splitTitleAndArtist(fullTitle) {
    const parts = fullTitle.split(' - ')
    if (parts.length >= 2) {
        const artist = parts[0].trim()
        const title = parts.slice(1).join(' - ').trim()
        return { artist, title }
    } else {
        return {
            title: fullTitle,
            artist: '',
        }
    }
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

function _createDemoStations() {
    const stations = loadFromStorage(STORAGE_KEY)
    if (stations?.length) return stations

    initLocalStations()
}

function getGenreColorByName(genreName) {
  const genres = [
    { name: 'Music', color: 'rgb(220, 20, 140)' },
    { name: 'Podcasts', color: 'rgb(0, 100, 80)' },
    { name: 'Live Events', color: 'rgb(132, 0, 231)' },
    { name: 'Made For You', color: 'rgb(30, 50, 100)' },
    { name: 'New Releases', color: 'rgb(96, 129, 8)' },
    { name: 'Pop', color: 'rgb(71, 125, 149)' },
    { name: 'Hip-Hop', color: 'rgb(71, 125, 149)' },
    { name: 'Rock', color: 'rgb(0, 100, 80)' },
    { name: 'Latin', color: 'rgb(13, 115, 236)' },
    { name: 'Podcast Charts', color: 'rgb(13, 115, 236)' },
    { name: 'Educational', color: 'rgb(71, 125, 149)' },
    { name: 'Documentary', color: 'rgb(80, 55, 80)' },
    { name: 'Comedy', color: 'rgb(175, 40, 150)' },
    { name: 'Charts', color: 'rgb(141, 103, 171)' },
    { name: 'Dance Electronic', color: 'rgb(71, 125, 149)' }, 
    { name: 'Mood', color: 'rgb(225, 17, 140)' },
    { name: 'Indie', color: 'rgb(233, 20, 41)' },
    { name: 'Workout', color: 'rgb(119, 119, 119)' }, 
    { name: 'Discover', color: 'rgb(141, 103, 171)' },
    { name: 'Country', color: 'rgb(216, 64, 0)' },
    { name: 'R&B', color: 'rgb(186, 93, 7)' }, 
    { name: 'K-pop', color: 'rgb(230, 30, 50)' },
    { name: 'Chill', color: 'rgb(176, 98, 57)' }, 
    { name: 'Sleep', color: 'rgb(30, 50, 100)' },
    { name: 'Party', color: 'rgb(141, 103, 171)' },
    { name: 'At Home', color: 'rgb(81, 121, 161)' },
    { name: 'Decades', color: 'rgb(165, 103, 82)' },
    { name: 'Love', color: 'rgb(220, 20, 140)' },
    { name: 'Metal', color: 'rgb(233, 20, 41)' },
    { name: 'Jazz', color: 'rgb(141, 103, 171)' },
    { name: 'Trending', color: 'rgb(176, 40, 151)' },
    { name: 'Wellness', color: 'rgb(20, 138, 8)' },
    { name: 'Anime', color: 'rgb(13, 115, 236)' },
    { name: 'Gaming', color: 'rgb(232, 17, 91)' },
    { name: 'Folk & Acoustic', color: 'rgb(188, 89, 0)' },
    { name: 'Focus', color: 'rgb(165, 103, 82)' },
    { name: 'Soul', color: 'rgb(220, 20, 140)' },
    { name: 'Kids & Family', color: 'rgb(13, 115, 236)' },
    { name: 'Classical', color: 'rgb(125, 75, 50)' },
    { name: 'TV & Movies', color: 'rgb(20, 138, 8)' },
    { name: 'Instrumental', color: 'rgb(83, 122, 161)' },
    { name: 'Punk', color: 'rgb(230, 30, 50)' },
    { name: 'Ambient', color: 'rgb(20, 138, 8)' },
    { name: 'Netflix', color: 'rgb(230, 30, 50)' },
    { name: 'Blues', color: 'rgb(13, 115, 236)' },
    { name: 'Cooking & Dining', color: 'rgb(186, 93, 7)' },
    { name: 'Alternative', color: 'rgb(225, 51, 0)' },
    { name: 'Travel', color: 'rgb(13, 114, 237)' },
    { name: 'Caribbean', color: 'rgb(13, 115, 236)' },
    { name: 'Afro', color: 'rgb(140, 25, 50)' },
    { name: 'GLOW', color: 'rgb(13, 115, 236)' },
    { name: 'Songwriters', color: 'rgb(140, 25, 50)' },
    { name: 'Nature & Noise', color: 'rgb(71, 125, 149)' },
    { name: 'Funk & Disco', color: 'rgb(175, 40, 150)' },
    { name: 'Spotify Singles', color: 'rgb(119, 119, 119)' },
    { name: 'Summer', color: 'rgb(39, 133, 106)' },
    { name: 'EQUAL', color: 'rgb(20, 138, 8)' },
    { name: 'RADAR', color: 'rgb(165, 103, 82)' },
    { name: 'Fresh Finds', color: 'rgb(225, 0, 144)' },
    { name: 'Tastemakers', color: 'rgb(232, 17, 91)' }
  ]

  const genre = genres.find(g => g.name === genreName)
  return genre ? genre.color : '#535353'
}