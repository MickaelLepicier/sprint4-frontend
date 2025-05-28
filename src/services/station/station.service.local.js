import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stationDB'

_createDemoStations()

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
  console.log('statisasdasdasdasdasdasdasdons:', stations)

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
  const demoData = loadFromStorage(STORAGE_KEY)
  if (!demoData || !demoData.length) {
    const demoStations = [
      {
        _id: 's001',
        name: 'Funky Monks',
        imgUrl: 'https://i.imgur.com/O9bYp9X.jpg',
        tags: ['Funk', 'Groove', '70s'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
        },
        likedByUsers: ['u201', 'u202'],
        songs: [
          {
            _id: '4_iC0MyIykM',
            title: 'The Meters - Cissy Strut',
            url: 'https://www.youtube.com/watch?v=4_iC0MyIykM',
            imgUrl: 'https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg',
            addedBy: 'u201',
            likedBy: ['u202'],
            addedAt: Date.now() - 10000000,
          },
          {
            _id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'https://www.youtube.com/watch?v=mUkfiLjooxs',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: 'u202',
            likedBy: ['u101'],
            addedAt: Date.now() - 8000000,
          },
          {
            _id: 'pZUC6ZrAkhI',
            title: 'James Brown - Get Up Offa That Thing',
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
        imgUrl: 'https://i.imgur.com/dRn5PpQ.jpg',
        tags: ['Chill', 'Study', 'Beats'],
        createdBy: {
          _id: 'u102',
          fullname: 'Dana Blue',
          imgUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
        },
        likedByUsers: ['u103'],
        songs: [
          {
            _id: '5qap5aO4i9A',
            title: 'lofi hip hop radio – beats to relax/study to',
            url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
            imgUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg',
            addedBy: 'u103',
            likedBy: ['u102'],
            addedAt: Date.now() - 4000000,
          },
          {
            _id: 'jfKfPfyJRdk',
            title: 'lofi beats to sleep/chill to',
            url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            imgUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg',
            addedBy: 'u102',
            likedBy: ['u101'],
            addedAt: Date.now() - 3000000,
          },
          {
            _id: 'DWcJFNfaw9c',
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
        imgUrl: 'https://i.imgur.com/N6T6vNT.jpg',
        tags: ['Rock', 'Classic', 'Legends'],
        createdBy: {
          _id: 'u105',
          fullname: 'Mike Thunder',
          imgUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
        },
        likedByUsers: ['u101', 'u102'],
        songs: [
          {
            _id: 'fJ9rUzIMcZQ',
            title: 'Queen – Bohemian Rhapsody',
            url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
            imgUrl: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: ['u101'],
            addedAt: Date.now() - 7000000,
          },
          {
            _id: 'xbhCPt6PZIU',
            title: 'AC/DC - Back In Black',
            url: 'https://www.youtube.com/watch?v=xbhCPt6PZIU',
            imgUrl: 'https://i.ytimg.com/vi/xbhCPt6PZIU/mqdefault.jpg',
            addedBy: 'u105',
            likedBy: ['u102'],
            addedAt: Date.now() - 5000000,
          },
          {
            _id: 'ZcXpKiY2MXE',
            title: 'Led Zeppelin - Stairway to Heaven',
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
