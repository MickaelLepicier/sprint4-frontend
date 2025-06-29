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
  SET_SHUFFLED_ORDER,
  SET_IS_SHUFFLE,
  SET_SONG,
  SET_CURRENT_STATION,
  SET_STATION_ORDER,
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
    return station
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
  console.log('station:',station)
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
  console.log('stationUPDATEDDD:', station)
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
  const state = store.getState()
  const user = state.userModule.user
  if (!user?._id) {
    throw new Error('User must be logged in to create a station')
  }

  const stations = store.getState().stationModule.stations
  const stationOrder = state.stationModule.stationOrder
  const userStations = stations.filter(station => station.createdBy?._id === user._id)
  const nextNum = userStations.length + 1
  const newStation = stationService.buildNewStationForUser(user, nextNum)

  const savedStation = await stationService.save(newStation)
  store.dispatch(getCmdAddStation(savedStation))

  const newOrder = [...stationOrder, savedStation._id]
  store.dispatch({ type: SET_STATION_ORDER, stationOrder: newOrder })
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

export function setStationOrder(stationOrder) {
  return store.dispatch({ type: SET_STATION_ORDER, stationOrder })
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

export function setIsPlaying(isPlaying) {
  try {
    store.dispatch({ type: SET_IS_PLAYING, isPlaying: !!isPlaying })
  } catch (err) {
    console.log('Cannot set isPlaying ', err)
    throw err
  }
}

export async function togglePlay(isPlaying) {
  const ref = window.playerRef
  if (!ref) console.error('Cannot togglePlay')

  if (isPlaying) {
    ref.current.pauseVideo()
  } else {
    ref.current.playVideo()
  }
}

export function nextSong(nextTrack) {
  try {
    store.dispatch({ type: SET_NEXT_SONG, song: nextTrack })
  } catch (err) {
    console.log('Cannot go to the next song ', err)
    throw err
  }
}

export function prevSong(prevTrack) {
  try {
    store.dispatch({ type: SET_PREV_SONG, song: prevTrack })
  } catch (err) {
    console.log('Cannot go to the preview song ', err)
    throw err
  }
}

export function setIsShuffle(isShuffle) {
  return store.dispatch({ type: SET_IS_SHUFFLE, isShuffle })
}

export function setShuffledOrder(shuffledOrder) {
  return store.dispatch({ type: SET_SHUFFLED_ORDER, shuffledOrder })
}

// Command Creators:
function getCmdSetStations(stations) {
  return {
    type: SET_STATIONS,
    stations,
  }
}
function getCmdSetStation(station) {
  return {
    type: SET_STATION,
    station,
  }
}
function getCmdRemoveStation(stationId) {
  return {
    type: REMOVE_STATION,
    stationId,
  }
}
function getCmdAddStation(station) {
  return {
    type: ADD_STATION,
    station,
  }
}
function getCmdUpdateStation(station) {
  return {
    type: UPDATE_STATION,
    station,
  }
}
function getCmdAddStationMsg(msg) {
  return {
    type: ADD_STATION_MSG,
    msg,
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadStations()
  await addStation(stationService.getEmptyStation())
  await updateStation({
    _id: 'm1oC7',
    title: 'Station-Good',
  })
  await removeStation('m1oC7')
  // TODO unit test addStationMsg
}
