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

const YT_API_KEY = import.meta.env.VITE_YT_API_KEY

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
  
  const isValidObjectId = (id) =>
    typeof id === 'string' && id.length === 24 && /^[a-f\d]{24}$/i.test(id);

  let stationToSave = {
    ...station,
    name: station.name || '',
    tags: station.tags || [],
    songs: station.songs || [],
    msgs: station.msgs || [],
    likedByUsers: station.likedByUsers || [],
    createdAt: station.createdAt || Date.now(),
  };

  if (isValidObjectId(station._id)) {
    return await httpService.put(`station/${station._id}`, stationToSave);
  } else {
    delete stationToSave._id; // <--- Only here!
    return await httpService.post('station', stationToSave);
  }
}

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

    const finalResults = detailsRes.data.items.map(item => ({
      id: item.id,
      url: item.id,
      title: item.snippet.title,
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
            maxResults: 3,
            key: YT_API_KEY,
          },
        })

        const songs = artistRes.data.items
          .filter(item => item.id?.videoId)
          .map((item, i) => ({
            id: item.id.videoId,
            videoId: item.id.videoId,
            title: item.snippet.title,
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
          .map((item, i) => ({
            id: item.snippet.resourceId.videoId,
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
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

// async function addStationMsg(stationId, txt) {
//     const savedMsg = await httpService.post(`station/${stationId}/msg`, { txt })
//     return savedMsg
// }
