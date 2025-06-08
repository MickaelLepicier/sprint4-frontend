import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'

import { userService } from '../services/user'
import { login } from '../store/user/user.actions'
import { AppLogo } from '../cmps/svg/AppLogo'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const navigate = useNavigate()

  async function onLogin(ev = null) {
    if (ev) ev.preventDefault()

    if (!credentials.username || !credentials.password) return

    try {
      await login(credentials)
      navigate('/')
      showSuccessMsg('Logged Succesfully')
    } catch (err) {
      console.error('Login failed:', err)
      showErrorMsg('Login failed')
    }
  }

  function handleChange(ev) {
    const field = ev.target.name
    const value = ev.target.value
    setCredentials({ ...credentials, [field]: value })
  }

  return (
    <section className="login-section">
      <form className="login-form" onSubmit={onLogin}>
        <section className="login-header"></section>
        <Link to="/" className="logo-link flex justify-center">
          <AppLogo />
        </Link>
        <h1>Log in to Spotify</h1>
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
        <button className="login-btn">Login</button>
      </form>

      <span className="to-signup">
        Don't have an account?{' '}
        <Link className="to-signup-link" to={'/signup'}>
          Sign up for Spotify
        </Link>
      </span>
    </section>
  )
}
