import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage,cleanTitle } from '../util.service'
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

// *** 'Using type: likedSongs' to differenciate from other stations ***
function _createDemoStations() {
  const demoData = loadFromStorage(STORAGE_KEY)
  if (!demoData || !demoData.length) {
    const demoStations = [
      {
        _id: 's001',
        // type: 'likedSongs', // <<<<< type: likedSongs
        name: 'Funky Monks',
        imgUrl: 'https://i.imgur.com/O9bYp9X.jpg',
        tags: ['Funk', 'Groove', '70s'],
        createdBy: {
          _id: 'u102',
          fullname: 'Dana Blue',
          imgUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
        },
        likedByUsers: ['u101', 'u202'],
        songs: [
          {
            id: '4_iC0MyIykM',
            title: 'Cissy Strut',
            artist: 'The Meters',
            url: 'https://www.youtube.com/watch?v=4_iC0MyIykM',
            imgUrl: 'https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg',
            addedBy: 'u201',
            likedBy: ['u202'],
            addedAt: Date.now() - 10000000,
          },
          {
            id: 'mUkfiLjooxs',
            title: "Pass The Peas",
            artist: `The JB's`,
            url: 'https://www.youtube.com/watch?v=mUkfiLjooxs',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: 'u202',
            likedBy: ['u101'],
            addedAt: Date.now() - 8000000,
          },
          {
            id: 'pZUC6ZrAkhI',
            title: 'Get Up Offa That Thing',
            artist: 'James Brown',
            url: 'https://www.youtube.com/watch?v=pZUC6ZrAkhI',
            imgUrl: 'https://i.ytimg.com/vi/pZUC6ZrAkhI/mqdefault.jpg',
            addedBy: 'u101',
            likedBy: ['u202'],
            addedAt: Date.now() - 6000000,
          },
        ],
        msgs: [
          { id: 'm101', from: 'u201', txt: 'Funky as always!' },
          { id: 'm102', from: 'u202', txt: '🔥🔥🔥' },
        ],
      },
      {
        _id: 's002',
        name: 'Lo-Fi Chill',
        //   // imgUrl: 'https://i.imgur.com/dRn5PpQ.jpg',
        imgUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg',
        tags: ['Chill', 'Study', 'Beats'],
        createdBy: {
          _id: 'u103',
          fullname: 'Mike Thunder',
          imgUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
        },
        likedByUsers: ['u101'],
        songs: [
          {
            id: '5qap5aO4i9A',
            title: 'lofi hip hop radio – beats to relax/study to',
            url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
            imgUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg',
            addedBy: 'u103',
            likedBy: ['u102'],
            addedAt: Date.now() - 4000000,
          },
          {
            id: 'jfKfPfyJRdk',
            title: 'lofi beats to sleep/chill to',
            url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            imgUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: ['u101'],
            addedAt: Date.now() - 3000000,
          },
          {
            id: 'DWcJFNfaw9c',
            title: 'Chillhop Essentials - Winter 2023',
            url: 'https://www.youtube.com/watch?v=DWcJFNfaw9c',
            imgUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg',
            addedBy: 'u103',
            likedBy: ['u101', 'u102'],
            addedAt: Date.now() - 2000000,
          },
        ],
        msgs: [
          { id: 'm201', from: 'u103', txt: 'Perfect for focus mode!' },
          { id: 'm202', from: 'u101', txt: 'Nice vibe' },
        ],
      },

      {
        _id: 's003',
        name: 'Classic Rock Hits',
        imgUrl: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
        tags: ['Rock', 'Classic', 'Legends'],
        createdBy: {
          _id: 'u105',
          fullname: 'Mike Thunder',
          imgUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
        },
        likedByUsers: ['u101', 'u102'],
        songs: [
          {
            id: 'fJ9rUzIMcZQ',
            title: 'Bohemian Rhapsody',
            artist: 'Queen',
            url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
            imgUrl: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: ['u101'],
            addedAt: Date.now() - 7000000,
          },
          {
            id: 'xbhCPt6PZIU',
            title: 'Back In Black',
            artist: 'AC/DC',
            url: 'https://www.youtube.com/watch?v=xbhCPt6PZIU',
            imgUrl: 'https://i.ytimg.com/vi/xbhCPt6PZIU/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: ['u102'],
            addedAt: Date.now() - 5000000,
          },
          {
            id: 'ZcXpKiY2MXE',
            title: 'Stairway to Heaven',
            aritst: 'Led Zeppelin',
            url: 'https://www.youtube.com/watch?v=ZcXpKiY2MXE',
            imgUrl: 'https://i.ytimg.com/vi/ZcXpKiY2MXE/mqdefault.jpg',
            addedBy: 'u101',
            likedBy: ['u105'],
            addedAt: Date.now() - 2000000,
          },
        ],
        msgs: [
          { id: 'm301', from: 'u102', txt: 'Rock on 🤘' },
          { id: 'm302', from: 'u105', txt: 'Legends never die' },
        ],
      },
      {
        _id: 'xyz123',
        name: 'Liked Songs',
        imgUrl: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
        tags: [],
        createdBy: {
          _id: 'u102',
          fullname: 'Puki Ben David',
          imgUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
        },
        likedByUsers: [],
        songs: [
          {
            id: 'mUkfiLjooxs',
            title: "Pass The Peas",
            artist: `The JB's`,
            url: 'https://www.youtube.com/watch?v=mUkfiLjooxs',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: 'u202',
            likedBy: ['u101'],
            addedAt: Date.now() - 8000000,
          },
          {
            id: 'jfKfPfyJRdk',
            title: 'lofi beats to sleep/chill to',
            url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            imgUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: ['u101'],
            addedAt: Date.now() - 3000000,
          },
          {
            id: 'DWcJFNfaw9c',
            title: 'Chillhop Essentials - Winter 2023',
            url: 'https://www.youtube.com/watch?v=DWcJFNfaw9c',
            imgUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg',
            addedBy: 'u103',
            likedBy: ['u102'],
            addedAt: Date.now() - 2000000,
          },
          {
            id: 'fJ9rUzIMcZQ',
            title: 'Bohemian Rhapsody',
            artist: 'Queen',
            url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
            imgUrl: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: ['u101'],
            addedAt: Date.now() - 7000000,
          },
          {
            id: 'Z6V7wGpY9qA',
            title: 'F*** the Pain Away',
            artist: 'Peaches',
            url: 'https://www.youtube.com/watch?v=Z6V7wGpY9qA',
            imgUrl: 'https://i.ytimg.com/vi/Z6V7wGpY9qA/mqdefault.jpg',
            addedBy: 'u101',
            likedBy: ['u105'],
            addedAt: Date.now() - 2000000,
          },

          {
            id: 'ZcXpKiY2MXE',
            title: 'Stairway to Heaven',
            artist: 'Led Zeppelin',
            url: 'https://www.youtube.com/watch?v=ZcXpKiY2MXE',
            imgUrl: 'https://i.ytimg.com/vi/ZcXpKiY2MXE/mqdefault.jpg',
            addedBy: 'u101',
            likedBy: ['u105'],
            addedAt: Date.now() - 2000000,
          },
          {
            id: '04854XqcfCY',
            title: 'We Are The Champions',
            artist: 'Queen',
            url: 'https://www.youtube.com/watch?v=04854XqcfCY',
            imgUrl: 'https://i.ytimg.com/vi/04854XqcfCY/mqdefault.jpg',
            addedBy: 'u101',
            likedBy: ['u105'],
            addedAt: Date.now() - 1800000,
          },
        ],
        msgs: [],
      },
      {
        _id: 's999',
        name: 'Modern Metal & Hard Rock',
        imgUrl: 'https://i.ytimg.com/vi/8nW-IPrzM1g/mqdefault.jpg', // Bring Me The Horizon
        tags: ['Metal', 'Hard Rock', 'Modern', 'Heavy'],
        createdBy: {
            _id: 'u102',
            fullname: 'Puki Ben David',
            imgUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
        },
        likedByUsers: ['u101'],
        songs: [
          {
            id: '8nW-IPrzM1g',
            title: 'Throne',
            artist: 'Bring Me The Horizon',
            url: 'https://www.youtube.com/watch?v=8nW-IPrzM1g',
            imgUrl: 'https://i.ytimg.com/vi/8nW-IPrzM1g/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: ['u102'],
            addedAt: Date.now() - 9_000_000,
          },
          {
            id: 'vza00f1eFeA',
            title: 'Doomsday',
            artist: 'Architects',
            url: 'https://www.youtube.com/watch?v=vza00f1eFeA',
            imgUrl: 'https://i.ytimg.com/vi/vza00f1eFeA/mqdefault.jpg',
            addedBy: 'u105', 
            likedBy: ['u101'],
            addedAt: Date.now() - 8_200_000,
          },
          {
            id: 'Zkqx1F6iAeQ',
            title: 'Silvera',
            artist: 'Gojira',
            url: 'https://www.youtube.com/watch?v=Zkqx1F6iAeQ',
            imgUrl: 'https://i.ytimg.com/vi/Zkqx1F6iAeQ/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: [],
            addedAt: Date.now() - 7_200_000,
          },
          {
            id: 'jqtB1rNbD74',
            title: 'Circle With Me',
            artist: 'Spiritbox',
            url: 'https://www.youtube.com/watch?v=jqtB1rNbD74',
            imgUrl: 'https://i.ytimg.com/vi/jqtB1rNbD74/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: ['u102'],
            addedAt: Date.now() - 6_700_000,
          },
          {
            id: 'VpATBBRajP8',
            title: 'Duality',
            artist: 'Slipknot',
            url: 'https://www.youtube.com/watch?v=VpATBBRajP8',
            imgUrl: 'https://i.ytimg.com/vi/VpATBBRajP8/mqdefault.jpg',
            addedBy: 'u104',
            likedBy: [],
            addedAt: Date.now() - 5_500_000,
          },
          {
            id: 'J9bNVJ1j6d0',
            title: 'Wild Eyes',
            artist: 'Parkway Drive',
            url: 'https://www.youtube.com/watch?v=J9bNVJ1j6d0',
            imgUrl: 'https://i.ytimg.com/vi/J9bNVJ1j6d0/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: ['u102'],
            addedAt: Date.now() - 4_000_000,
          },
          {
            id: 'bkysjcs5vFU',
            title: 'I Miss The Misery',
            artist: 'Halestorm',
            url: 'https://www.youtube.com/watch?v=bkysjcs5vFU',
            imgUrl: 'https://i.ytimg.com/vi/bkysjcs5vFU/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: [],
            addedAt: Date.now() - 2_900_000,
          },
          {
            id: 'ere2Mstl8ww',
            title: 'Figure It Out',
            artist: 'Royal Blood',
            url: 'https://www.youtube.com/watch?v=ere2Mstl8ww',
            imgUrl: 'https://i.ytimg.com/vi/ere2Mstl8ww/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: [],
            addedAt: Date.now() - 2_000_000,
          },
          {
            id: 'QXJ6kBqTm6U',
            title: 'Jenny',
            artist: 'Nothing More',
            url: 'https://www.youtube.com/watch?v=QXJ6kBqTm6U',
            imgUrl: 'https://i.ytimg.com/vi/QXJ6kBqTm6U/mqdefault.jpg',
            addedBy: 'u103',
            likedBy: ['u102'],
            addedAt: Date.now() - 1_500_000,
          },
          {
            id: 'fKopy74weus',
            artist: 'Disturbed',
            title: 'Stricken',
            url: 'https://www.youtube.com/watch?v=fKopy74weus',
            imgUrl: 'https://i.ytimg.com/vi/fKopy74weus/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: ['u102'],
            addedAt: Date.now() - 1_200_000,
          },
          {
            id: 'CSvFpBOe8eY',
            artist: 'Avenged Sevenfold',
            title: 'Hail to the King',
            url: 'https://www.youtube.com/watch?v=CSvFpBOe8eY',
            imgUrl: 'https://i.ytimg.com/vi/CSvFpBOe8eY/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: [],
            addedAt: Date.now() - 1_100_000,
          },
          {
            id: 'CD-E-LDc384',
            artist: 'Five Finger Death Punch',
            title: 'Wrong Side Of Heaven',
            url: 'https://www.youtube.com/watch?v=CD-E-LDc384',
            imgUrl: 'https://i.ytimg.com/vi/CD-E-LDc384/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: ['u102'],
            addedAt: Date.now() - 1_000_000,
          },
          {
            id: 'AkFqg5wAuFk',
            artist: 'Breaking Benjamin',
            title: 'The Diary of Jane',
            url: 'https://www.youtube.com/watch?v=AkFqg5wAuFk',
            imgUrl: 'https://i.ytimg.com/vi/AkFqg5wAuFk/mqdefault.jpg',
            addedBy: 'u104',
            likedBy: [],
            addedAt: Date.now() - 900_000,
          },
          {
            id: '9sTQ0QdkN3Q',
            artist: 'Shinedown',
            title: 'Sound of Madness',
            url: 'https://www.youtube.com/watch?v=9sTQ0QdkN3Q',
            imgUrl: 'https://i.ytimg.com/vi/9sTQ0QdkN3Q/mqdefault.jpg',
            addedBy: 'u103',
            likedBy: ['u102'],
            addedAt: Date.now() - 800_000,
          },
          {
            id: 'Q0oIoR9mLwc',
            artist: 'Linkin Park',
            title: 'Faint',
            url: 'https://www.youtube.com/watch?v=Q0oIoR9mLwc',
            imgUrl: 'https://i.ytimg.com/vi/Q0oIoR9mLwc/mqdefault.jpg',
            addedBy: 'u104',
            likedBy: [],
            addedAt: Date.now() - 700_000,
          },
          {
            id: 'WM8bTdBs-cw',
            artist: 'Rammstein',
            title: 'Du Hast',
            url: 'https://www.youtube.com/watch?v=WM8bTdBs-cw',
            imgUrl: 'https://i.ytimg.com/vi/WM8bTdBs-cw/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: ['u102'],
            addedAt: Date.now() - 600_000,
          },
          {
            id: '1w7OgIMMRc4',
            artist: 'Bullet For My Valentine',
            title: 'Tears Don’t Fall',
            url: 'https://www.youtube.com/watch?v=1w7OgIMMRc4',
            imgUrl: 'https://i.ytimg.com/vi/1w7OgIMMRc4/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: [],
            addedAt: Date.now() - 500_000,
          },
          {
            id: 'DelhLppPSxY',
            artist: 'System Of A Down',
            title: 'Chop Suey!',
            url: 'https://www.youtube.com/watch?v=DelhLppPSxY',
            imgUrl: 'https://i.ytimg.com/vi/DelhLppPSxY/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: ['u102'],
            addedAt: Date.now() - 400_000,
          },
          {
            id: 'dxytyRy-O1k',
            artist: 'Papa Roach',
            title: 'Last Resort',
            url: 'https://www.youtube.com/watch?v=dxytyRy-O1k',
            imgUrl: 'https://i.ytimg.com/vi/dxytyRy-O1k/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: [],
            addedAt: Date.now() - 300_000,
          },
        ],
        msgs: [],
      }
    ]
    saveToStorage(STORAGE_KEY, demoStations)
  }
}

// async function addCarMsg(carId, txt) {
//     // Later, this is all done by the backend
//     const car = await getById(carId)

//     const msg = {
//         id: makeId(),
//         by: userService.getLoggedinUser(),
//         txt
//     }
//     car.msgs.push(msg)
//     await storageService.put(STORAGE_KEY, car)

//     return msg
// }
