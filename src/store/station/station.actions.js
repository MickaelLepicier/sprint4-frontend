import { stationService } from '../../services/station'
import { store } from '../store'
import {
  ADD_STATION,
  REMOVE_STATION,
  SET_STATIONS,
  SET_STATION,
  UPDATE_STATION,
  ADD_STATION_MSG,
  SET_IS_PLAYING,
  SET_NEXT_SONG,
  SET_PREV_SONG,
  SET_SONG,
  SET_CURRENT_STATION
} from './station.reducer'

export async function loadStations(filterBy) {
  try {
    const stations = await stationService.query(filterBy)
    store.dispatch(getCmdSetStations(stations))
  } catch (err) {
    console.log('Cannot load stations', err)
    throw err
  }
}

export async function loadStation(stationId) {
  try {
    const station = await stationService.getById(stationId)
    store.dispatch(getCmdSetStation(station))
  } catch (err) {
    console.log('Cannot load station', err)
    throw err
  }
}

export async function removeStation(stationId) {
  try {
    await stationService.remove(stationId)
    store.dispatch(getCmdRemoveStation(stationId))
  } catch (err) {
    console.log('Cannot remove station', err)
    throw err
  }
}

export async function addStation(station) {
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdAddStation(savedStation))
    return savedStation
  } catch (err) {
    console.log('Cannot add station', err)
    throw err
  }
}

export async function updateStation(station) {
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdUpdateStation(savedStation))
    return savedStation
  } catch (err) {
    console.log('Cannot save station', err)
    throw err
  }
}

export async function createStationForUser() {
    const user = store.getState().userModule.user
    if (!user?._id) {
      throw new Error('User must be logged in to create a station')
    }
    
    const stations = store.getState().stationModule.stations
    const userStations = stations.filter(station => station.createdBy?._id === user._id)
    const nextNum = userStations.length + 1
    const newStation = stationService.buildNewStationForUser(user, nextNum)
    
    const savedStation = await stationService.save(newStation)
    store.dispatch(getCmdAddStation(savedStation))
    console.log(savedStation) 
    return savedStation
}


export async function addStationMsg(stationId, txt) {
  try {
    const msg = await stationService.addStationMsg(stationId, txt)
    store.dispatch(getCmdAddStationMsg(msg))
    return msg
  } catch (err) {
    console.log('Cannot add station msg', err)
    throw err
  }
}

// Updated setSong
export function setSong(song, station) {
  console.log('~~~SONG~~', song)
  console.log('~~~STATION~~', station)
    try {
      store.dispatch({ type: SET_SONG, song })
      store.dispatch({ type: SET_CURRENT_STATION, station }) // Added line
    } catch (err) {
      console.error('Failed to set song:', err)
    }
}
// Previous setSong -> missing currStation
// export async function setSong(song) {
//   try {
//     store.dispatch({ type: SET_SONG, song })
//   } catch (err) {
//     console.log('Cannot set song ', err)
//     throw err
//   }
// }

export function setIsPlaying(isPlaying) {
  try {
    store.dispatch({ type: SET_IS_PLAYING, isPlaying: !!isPlaying })
  } catch (err) {
    console.log('Cannot set isPlaying ', err)
    throw err
  }
}
// export async function setIsPlaying() {
//   try {
//     store.dispatch({ type: SET_IS_PLAYING })
//   } catch (err) {
//     console.log('Cannot set isPlaying ', err)
//     throw err
//   }
// }

export async function togglePlay(isPlaying) {
  const ref = window.playerRef
  if (isPlaying) {
    ref.current.pauseVideo()
  } else {
    ref.current.playVideo()
  }
}

export function nextSong() {
  const state = store.getState().stationModule
  const { currentStation, currentSong } = state

  if (!currentStation || !currentStation.songs?.length) return

  const currIdx = currentStation.songs.findIndex(song => song._id === currentSong?._id)
  const nextIdx = (currIdx + 1) % currentStation.songs.length
  const nextSong = currentStation.songs[nextIdx]

  store.dispatch({ type: SET_NEXT_SONG, song: nextSong })
}
// export async function nextSong() {
//   store.dispatch({ type: SET_NEXT_SONG })
// }

export function prevSong() {
  const state = store.getState().stationModule
  const { currentStation, currentSong } = state

  if (!currentStation?.songs?.length) return

  const currIdx = currentStation.songs.findIndex(song => song._id === currentSong?._id)
  if (currIdx === -1) return

  const prevIdx = (currIdx - 1 + currentStation.songs.length) % currentStation.songs.length
  const prevSong = currentStation.songs[prevIdx]

  store.dispatch({ type: SET_PREV_SONG, song: prevSong })
}
// export async function prevSong() {
//   store.dispatch({ type: SET_PREV_SONG })
// }

// Command Creators:
function getCmdSetStations(stations) {
  return {
    type: SET_STATIONS,
    stations
  }
}
function getCmdSetStation(station) {
  return {
    type: SET_STATION,
    station
  }
}
function getCmdRemoveStation(stationId) {
  return {
    type: REMOVE_STATION,
    stationId
  }
}
function getCmdAddStation(station) {
  return {
    type: ADD_STATION,
    station
  }
}
function getCmdUpdateStation(station) {
  return {
    type: UPDATE_STATION,
    station
  }
}
function getCmdAddStationMsg(msg) {
  return {
    type: ADD_STATION_MSG,
    msg
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadStations()
  await addStation(stationService.getEmptyStation())
  await updateStation({
    _id: 'm1oC7',
    title: 'Station-Good'
  })
  await removeStation('m1oC7')
  // TODO unit test addStationMsg
}
