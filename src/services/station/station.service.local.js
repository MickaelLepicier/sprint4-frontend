import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stationDB'

export const stationService = {
  query,
  getById,
  save,
  remove,
  // addCarMsg
}
window.cs = stationService

async function query(filterBy = { txt: '' }) {
  var stations = await storageService.query(STORAGE_KEY)
  const { txt, tag, sortField = 'asc', sortDir, onlyLiked } = filterBy

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

async function save(station) {
  var savedStation
  if (station._id) {
    const stationToSave = {
      ...station,
    }
    savedStation = await storageService.put(STORAGE_KEY, stationToSave)
  } else {
    const stationToSave = {
      name: station.name || '',
      tags: station.tags || [],
      songs: [],
      msgs: [],
      // createdBy:userService.getLoggedinUser()
      // likedByUsers:[]
    }
    savedStation = await storageService.post(STORAGE_KEY, stationToSave)
  }
  return savedStation
}


function _createDemoStations() {
  const demoStations = [
    {
      _id: 's001',
      name: 'Funky Monks',
      tags: ['Funk', 'Happy'],
      createdBy: {
        _id: 'u101',
        fullname: 'Puki Ben David',
        imgUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
      },
      likedByUsers: ['u201', 'u202'],
      songs: [
        {
          id: '4_iC0MyIykM',
          title: 'The Meters - Cissy Strut',
          url: 'https://www.youtube.com/watch?v=4_iC0MyIykM',
          imgUrl: 'https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg',
          addedBy: 'u201',
          likedBy: ['u202'],
          addedAt: Date.now() - 10000000,
        },
        {
          id: 'mUkfiLjooxs',
          title: "The JB's - Pass The Peas",
          url: 'https://www.youtube.com/watch?v=mUkfiLjooxs',
          imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
          addedBy: 'u202',
          likedBy: ['u101'],
          addedAt: Date.now() - 5000000,
        },
      ],
      msgs: [
        {
          id: 'm101',
          from: 'u101',
          txt: 'Manish?',
        },
        {
          id: 'm102',
          from: 'u202',
          txt: 'This groove slaps!',
        },
      ],
    },

    {
      _id: 's002',
      name: 'Lo-Fi Chill',
      tags: ['Chill', 'Study', 'Beats'],
      createdBy: {
        _id: 'u102',
        fullname: 'Dana Blue',
        imgUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
      },
      likedByUsers: ['u103'],
      songs: [
        {
          id: '5qap5aO4i9A',
          title: 'lofi hip hop radio – beats to relax/study to',
          url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
          imgUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg',
          addedBy: 'u103',
          likedBy: ['u102'],
          addedAt: Date.now() - 3000000,
        },
      ],
      msgs: [
        {
          id: 'm201',
          from: 'u103',
          txt: 'Perfect for coding!',
        },
      ],
    },
  ]

  return demoStations
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
