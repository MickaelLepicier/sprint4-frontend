import { storageService } from '../async-storage.service'

const USER_KEY = 'user'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

_createDemoUsers()

export const userService = {
  login,
  logout,
  signup,
  getUsers,
  getById,
  remove,
  update,
  getLoggedinUser,
}

function getUsers() {
  return storageService.query('user')
}

async function getById(userId) {
  return await storageService.get('user', userId)
}

function remove(userId) {
  return storageService.remove('user', userId)
}

async function update(newUser) {
  const existingUser = await storageService.get('user', newUser._id)

  if (!existingUser) throw new Error('User not found')

  const updatedUser = { ...existingUser, ...newUser }

  await storageService.put('user', updatedUser)

  const loggedinUser = getLoggedinUser()
  if (loggedinUser._id === updatedUser._id) _saveLocalUser(updatedUser)

  return updatedUser
}

async function login(userCred) {
  const users = await storageService.query('user')
  const user = users.find(user => user.username === userCred.username)

  if (user) return _saveLocalUser(user)
}

async function signup(userCred) {
  if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

  const user = await storageService.post('user', userCred)
  return _saveLocalUser(user)
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _saveLocalUser(user) {
  const { _id, fullname, imgUrl, isAdmin } = user

  const localUser = {
    _id,
    fullname,
    imgUrl,
    likedSongsStationId: user.likedSongsStationId,
    likedStationIds: user.likedStationIds,
    likedSongIds: [], // IN CASE WE DECIDE TO DO DIFFERENT FETCHING OF SONG DATA
    isAdmin: !!isAdmin,
  }

  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(localUser))
  return localUser
}

// To quickly create an admin user, uncomment the next line
// _createAdmin()
async function _createAdmin() {
  const user = {
    username: 'admin',
    password: 'admin',
    fullname: 'Mustafa Adminsky',
    imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
    score: 10000,
  }

  const newUser = await storageService.post('user', userCred)
  console.log('newUser: ', newUser)
}

async function _createDemoUsers() {
  try {
    const users = await storageService.query(USER_KEY)
    if (users?.length) return

    const demoUsers = [
      {
        _id: 'u123',
        username: 'puki',
        password: '123',
        fullname: 'Puki Ben David',
        imgUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
        likedStationIds: ['s002', 's003', 's999'],
        likedSongIds: ['mUkfiLjooxs', 'jfKfPfyJRdk', 'DWcJFNfaw9c', 'fJ9rUzIMcZQ', 'ZcXpKiY2MXE'],
        likedSongsStationId: 'xyz123',
        isAdmin: false,
      },
      {
        _id: 'u102',
        username: 'admin',
        password: 'admin',
        fullname: 'Admin User',
        imgUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
        likedStationIds: [],
        likedSongIds: [],
        likedSongsStationId: 'liked998',
        isAdmin: true,
      },
    ]

    for (const user of demoUsers) {
      await storageService.post(USER_KEY, user)
    }
  } catch (err) {
    console.error('Failed to create demo users:', err)
  }
}

async function _loginDemoUser() {
  const users = await userService.getUsers()
  const demoUser = users.find(user => user.username === 'puki')

  if (demoUser) {
    sessionStorage.setItem(
      'loggedinUser',
      JSON.stringify({
        _id: demoUser._id,
        fullname: demoUser.fullname,
        imgUrl: demoUser.imgUrl,
        isAdmin: !!demoUser.isAdmin,
      })
    )
    console.log('Logged in as demo user:', demoUser.fullname)
  }
}
