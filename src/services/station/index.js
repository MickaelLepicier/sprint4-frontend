const { DEV, VITE_LOCAL } = import.meta.env
import { getRandomIntInclusive, makeId } from '../util.service'

import { stationService as local } from './station.service.local'
import { stationService as remote } from './station.service.remote'

function getEmptyStation() {
  return {
    _id: makeId(),
    name: '',
    tags: [],
    createdBy: {
      _id: userId,
      fullname: '',
      imgUrl: '',
    },
    likedByUsers: [],
    songs: [],
    msgs: [],
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    tag: '',
    sortField: '',
    sortDir: 'asc',
    onlyLiked: false,
    // pageIdx: 0
  }
}

// console.log('VITE_LOCAL:', VITE_LOCAL)

const service = VITE_LOCAL === 'true' ? local : remote
export const stationService = { getEmptyStation, getDefaultFilter, ...service }

//* Easy access to this service from the dev tools console
//* when using script - dev / dev:local

if (DEV) window.stationService = stationService
