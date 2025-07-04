import { useRef, useState } from 'react'
import { useNavigate, useLocation, Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../store/user/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadSearchResults } from '../store/search/search.actions'

import { AppLogo } from './svg/AppLogo'
import { HomeIcon } from './svg/HomeIcon'
import { HomeIconFilled } from './svg/HomeIconFilled'
import { SearchIconLarge } from './svg/SearchIconLarge'
import { ClearIconLarge } from './svg/ClearIconLarge'
import { BrowseIcon } from './svg/BrowseIcon'
import { BrowseIconFilled } from './svg/BrowseIconFilled'
import { debounce } from '../services/util.service'
import { AuthBtns } from './util/AuthBtns'
import { LOADING_DONE, LOADING_START } from '../store/system/system.reducer'

export function AppHeader() {
  const [filterBy, setFilterBy] = useState({ txt: '' })
  const [searchTxt, setSearchTxt] = useState('')

  const user = useSelector(storeState => storeState.userModule.user)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const locPath = {
    isHome: location.pathname === '/',
    isBrowse: location.pathname === '/search',
  }

  async function performSearch(txt) {
    if (!txt.trim()) return
    try {
      dispatch({ type: LOADING_START })

      await loadSearchResults(txt, 'stations', 4)

      navigate(`/search/${txt}`)
    } catch (err) {
      showErrorMsg('Search failed')
    } finally {
      dispatch({ type: LOADING_DONE })
    }
  }

  const debouncedSearch = useRef(
    debounce(async txt => {
      try {
        await performSearch(txt)
      } catch (err) {
        // showErrorMsg('Search failed')
      }
    }, 500)
  ).current

  function onSubmitSearch(ev) {
    ev.preventDefault()
    performSearch(searchTxt)
  }

  function handleChange(ev) {
    const val = ev.target.value
    setSearchTxt(val)
    debouncedSearch(val)
  }
  // async function onLogout() {
  //   try {
  //     await logout()
  //     navigate('/')
  //     showSuccessMsg(`Bye now`)
  //   } catch (err) {
  //     showErrorMsg('Cannot logout')
  //   }
  // }

  function onSetFilterBy(filterBy) {
    setFilterBy(filterBy)
  }

  function onGoHome() {
    setSearchTxt('')
    navigate('/')
  }

  function onBrowseGenres() {
    setSearchTxt('')
    navigate('/search')
  }

  return (
    <header className="app-header full flex align-center">
      {/* Left side: Logo and Home button */}
      <div className="header-left flex align-center justify-center space-between">
        <Link to="/" className="logo-link flex justify-center">
          <AppLogo />
        </Link>
      </div>

      {/* Center: Search form */}
      <div className="header-center flex justify-center">
        <button onClick={onGoHome} className="home-btn flex align-center justify-center" aria-label="Home">
          {locPath.isHome ? <HomeIconFilled /> : <HomeIcon />}
        </button>

        <div className="search-form-container">
          <form className="search-form" role="search" onSubmit={onSubmitSearch}>
            <button className="search-btn" aria-label="Search">
              <SearchIconLarge />
            </button>

            <input
              className="search-input"
              type="search"
              placeholder="What do you want to play?"
              aria-label="What do you want to play?"
              value={searchTxt}
              onChange={handleChange}
            />

            <div className="browse-and-clean-wrapper">
              {searchTxt && (
                <button className="clear-text-btn" type="button" aria-label="Clear" onClick={() => setSearchTxt('')}>
                  <ClearIconLarge />
                </button>
              )}

              <div className="border-line">
                <button type="button" onClick={onBrowseGenres} className="browse-btn" aria-label="Browse">
                  {locPath.isBrowse ? <BrowseIconFilled /> : <BrowseIcon />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right side: Sign Up, Log In */}
      <AuthBtns user={user} />

      {/* <div className="header-right flex">
        {user ? (
          <span className="login-btn-inner" onClick={onLogout}>
            Logout
          </span>
        ) : (
          <>
            <NavLink to="signup" className="signup-btn">
              Sign up
            </NavLink>
            <NavLink to="login" className="login-btn">
              <span className="login-btn-inner">Login</span>
            </NavLink>
          </>
        )}
      </div> */}
    </header>
  )
}
