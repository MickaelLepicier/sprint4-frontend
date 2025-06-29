import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { signup, updateUser } from '../store/user/user.actions'

import { ImgUploader } from '../cmps/ImgUploader'
import { userService } from '../services/user'
import { stationService } from '../services/station'
import { AppLogo } from '../cmps/svg/AppLogo'
import { addStation, removeStation, updateStation } from '../store/station/station.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function Signup() {
  const [credentials, setCredentials] = useState(userService.getEmptyUser())
  const [userStation, setUserStation] = useState(stationService.getEmptyStation())

  const navigate = useNavigate()

  function clearState() {
    setCredentials(userService.getEmptyUser())
  }

  function handleChange(ev) {
    const field = ev.target.name
    const value = ev.target.value
    setCredentials(credentials => ({ ...credentials, [field]: value }))
  }

  async function onSignup(ev = null) {
    if (ev) ev.preventDefault()
    if (!credentials.username || !credentials.password || !credentials.fullname) return

    try {
      // 1. Signup user
      const user = await signup(credentials)
      console.log('user:', user)

      // 2. Prepare station for user
      const userStation = {
        ...stationService.getEmptyStation(),
        name: 'Liked Songs',
        createdBy: {
          _id: user._id,
          fullname: user.fullname,
          imgUrl: user.imgUrl,
        },
        imgUrl: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
      }

      const station = await addStation(userStation)

      // 4. Update user with station id
      await updateUser({ ...user, username: credentials.username, likedSongsStationId: station._id })

      clearState()
      navigate('/')
      showSuccessMsg('Signed up successfully')
    } catch (error) {
      showErrorMsg('Signup failed')
      // handle cleanup if needed
    }
  }

  function onUploaded(imgUrl) {
    setCredentials(credentials => ({ ...credentials, imgUrl }))
  }

  return (
    <section className="signup-section">
      <form className="signup-form" onSubmit={onSignup}>
        <section className="signup-header"></section>
        <Link to="/" className="logo-link flex justify-center">
          <AppLogo />
        </Link>
        <h1>Sign up to start listening</h1>
        <input
          type="text"
          name="fullname"
          value={credentials.fullname}
          placeholder="Fullname"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          value={credentials.username}
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <ImgUploader onUploaded={onUploaded} />
        <button className="signup-btn">Signup</button>
      </form>

      <span className="to-login">
        Allready have an account?
        <Link className="to-login-link" to={'/login'}>
          Log in here
        </Link>
      </span>
    </section>
  )
}
