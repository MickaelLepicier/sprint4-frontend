import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const BASE_URL = 'auth/'

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  getById,
  getUsers,
  remove,
  update,
}

function getUsers() {
  return httpService.get(`user`)
}

async function getById(userId) {
  const user = await httpService.get(`user/${userId}`)
  return user
}

async function update({ _id, score }) {
  const user = await httpService.put(`user/${_id}`, { _id, score })

  // When admin updates other user's details, do not update loggedinUser
  const loggedinUser = getLoggedinUser() // Might not work because its defined in the main service???
  if (loggedinUser._id === user._id) _saveLocalUser(user)

  return user
}

function remove(userId) {
  return httpService.delete(`user/${userId}`)
}

async function login(userCred) {
  try {
    const user = await httpService.post(BASE_URL + 'login', userCred)
    if (user) return _saveLocalUser(user)
  } catch (error) {
    console.log('Could not login')
    throw error
  }
}

async function signup(userCred) {
  try {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await httpService.post(BASE_URL + 'signup', userCred)
    return _saveLocalUser(user)
  } catch (error) {
    console.log('Could not signup')
    throw error
  }
}

async function logout() {
  try {
    await httpService.post(BASE_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  } catch (error) {
    console.log('Could not logout')
    throw error
  }
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
    likedSongIds: user.likedSongIds || [],
    isAdmin: !!isAdmin,
  }

  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(localUser))
  return localUser
}
