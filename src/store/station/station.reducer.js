export const SET_STATIONS = 'SET_STATIONS'
export const SET_STATION = 'SET_STATION'
export const SET_CURRENT_STATION = 'SET_CURRENT_STATION'
export const SET_SONG = 'SET_SONG'
export const SET_IS_PLAYING = 'SET_IS_PLAYING'
export const REMOVE_STATION = 'REMOVE_STATION'
export const ADD_STATION = 'ADD_STATION'
export const UPDATE_STATION = 'UPDATE_STATION'
export const ADD_STATION_MSG = 'ADD_STATION_MSG'
export const SET_STATION_ORDER = 'SET_STATION_ORDER'

export const SET_NEXT_SONG = 'SET_NEXT_SONG'
export const SET_PREV_SONG = 'SET_PREV_SONG'

export const SET_LYRICS_CACHE = 'SET_LYRICS_CACHE'

const initialState = {
  stations: [],
  station: null, // this will get updated whenever we VISIT ***ANY*** station
  currentSong: null, // curr playing song
  currentStation: null, // curr playing station
  isPlaying: false,
  lyricsCache: {}, // store lyrics for played songs
  stationOrder: []
}

export function stationReducer(state = initialState, action) {
  var newState = state
  var stations
  switch (action.type) {
    case SET_STATIONS:
      newState = { ...state, stations: action.stations }
      break
    case SET_STATION:
      newState = { ...state, station: action.station }
      break
    case REMOVE_STATION:
      const lastRemovedStation = state.stations.find(station => station._id === action.stationId)
      stations = state.stations.filter(station => station._id !== action.stationId)
      newState = { ...state, stations, lastRemovedStation }
      break
    case ADD_STATION:
      newState = { ...state, stations: [...state.stations, action.station] }
      break
    case UPDATE_STATION:
      stations = state.stations.map(station => (station._id === action.station._id ? action.station : station))
      newState = {
        ...state,
        stations,
        station: state.station?._id === action.station._id ? action.station : state.station,
      }
      break
    case ADD_STATION_MSG:
      newState = { ...state, station: { ...state.station, msgs: [...(state.station.msgs || []), action.msg] } }
      break
    case SET_SONG:
      newState = { ...state, currentSong: action.song }
      break
    case SET_CURRENT_STATION:
      newState = { ...state, currentStation: action.station }
      break
    case SET_IS_PLAYING:
      newState = { ...state, isPlaying: action.isPlaying }
      break
    // case SET_IS_PLAYING:
    //   newState = { ...state, isPlaying: !state.isPlaying }
    //   break

    case SET_NEXT_SONG:
      newState =  { ...state, currentSong: action.song }
      break
    // case SET_NEXT_SONG:
    //   if (!state.station || !state.station.songs || state.station.songs.length === 0) return state

    //   const currIdx = state.station.songs.findIndex(song => song.id === state.currentSong?.id)
    //   const nextIdx = (currIdx + 1) % state.station.songs.length
    //   const nextSong = state.station.songs[nextIdx]

    //   newState = { ...state, currentSong: nextSong }
    //   break

    case SET_PREV_SONG:
      newState = { ...state, currentSong: action.song }
      break
    // case SET_PREV_SONG:
    //   if (!state.station || !state.station.songs || state.station.songs.length === 0) return state

    //   const _currIdx = state.station.songs.findIndex(song => song.id === state.currentSong?.id)
    //   if (_currIdx === -1) return state

    //   const prevIdx = (_currIdx - 1 + state.station.songs.length) % state.station.songs.length
    //   const prevSong = state.station.songs[prevIdx]

    //   newState = { ...state, currentSong: prevSong }
    //   break
    case SET_LYRICS_CACHE:
      newState = {
        ...state, lyricsCache: { ...state.lyricsCache, [action.cacheKey]: action.lyrics }
      }
      break
    case SET_STATION_ORDER:
      newState = { ...state, stationOrder: action.stationOrder }
      break

    default:
  }
  return newState
}

// unitTestReducer()

function unitTestReducer() {
  var state = initialState
  const station1 = { _id: 'b101', vendor: 'Station ' + parseInt(Math.random() * 10), msgs: [] }
  const station2 = { _id: 'b102', vendor: 'Station ' + parseInt(Math.random() * 10), msgs: [] }

  state = stationReducer(state, { type: SET_STATIONS, stations: [station1] })
  console.log('After SET_STATIONS:', state)

  state = stationReducer(state, { type: ADD_STATION, station: station2 })
  console.log('After ADD_STATION:', state)

  state = stationReducer(state, { type: UPDATE_STATION, station: { ...station2, vendor: 'Good' } })
  console.log('After UPDATE_STATION:', state)

  state = stationReducer(state, { type: REMOVE_STATION, stationId: station2._id })
  console.log('After REMOVE_STATION:', state)

  const msg = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some msg' }
  state = stationReducer(state, { type: ADD_STATION_MSG, stationId: station1._id, msg })
  console.log('After ADD_STATION_MSG:', state)

  state = stationReducer(state, { type: REMOVE_STATION, stationId: station1._id })
  console.log('After REMOVE_STATION:', state)
}
