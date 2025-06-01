import { useRef, useState } from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { logout } from '../store/user/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { loadSearchResults } from '../store/search/search.actions'

import { AppLogo } from './svg/AppLogo'
import { HomeIcon } from './svg/HomeIcon'
import { SearchIcon } from './svg/SearchIcon'
import { BrowseIcon } from './svg/BrowseIcon'
import { debounce } from '../services/util.service'

export function AppHeader() {
  const [filterBy, setFilterBy] = useState({ txt: '' })

  const user = useSelector(storeState => storeState.userModule.user)
  const [searchTxt, setSearchTxt] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const performSearch = async txt => {
    if (!txt.trim()) return
    try {
      await dispatch(loadSearchResults(txt, 'stations'))
      navigate(`/search/${txt}`)
    } catch (err) {
      showErrorMsg('Search failed')
    }
  }

  const debouncedSearch = useRef(debounce(performSearch, 500)).current

  function onSubmitSearch(ev) {
    ev.preventDefault()
    performSearch(searchTxt)
  }

  function handleChange(ev) {
    const val = ev.target.value
    setSearchTxt(val)
    debouncedSearch(val)
  }
  async function onLogout() {
    try {
      await logout()
      navigate('/')
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg('Cannot logout')
    }
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(filterBy)
  }

  function onGoHome() {
    navigate('/')
  }

  function onBrowseGenres() {
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
          <HomeIcon />
        </button>

        <div className="search-form-container">
          <form className="search-form" role="search" onSubmit={onSubmitSearch}>
            <button className="search-btn" aria-label="Search">
              <SearchIcon />
            </button>

            <input
              className="search-input"
              type="search"
              placeholder="What do you want to play?"
              aria-label="What do you want to play?"
              value={searchTxt}
              onChange={handleChange}
            />

            <button onClick={onBrowseGenres} className="browse-btn" aria-label="Browse">
              <BrowseIcon />
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Sign Up, Log In */}
      <div className="header-right flex">
        <button className="signup-btn">Sign up</button>
        <button className="login-btn">
          <span className="login-btn-inner">Log in</span>
        </button>
      </div>
    </header>
  )
}

// ==========================
// Old AppHeader Structure
// ==========================
// return (
//     <header className="app-header main-container full">

//         <nav className=''>
//             {/* Logo Link */}
//             <NavLink to="/home" className="/logo">
//                 <img src="../img/logo/logo.png" alt="Logo" className="logo-img" />
//             </NavLink>

//             {/* Home Navigation Link */}
//             <NavLink to="/home">Home</NavLink>

//             {/* Center Section: Station Filter */}
//             <StationFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />

//             {/* Admin Link - Visible Only to Admin Users */}
//             {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

//             {/* Guest User Links (Signup / Login) */}
//             {!user && (
//                 <div className="user-info">
//                     <NavLink to="signup" className="signup-link">Sign up</NavLink>
//                     <NavLink to="login" className="login-link">Login</NavLink>
//                 </div>
//             )}

//             {/* Logged-in User Section */}
//             {user && (
//                 <div className="user-info">
//                     <Link to={`user/${user._id}`}>
//                         {user.imgUrl && <img src={user.imgUrl} />}
//                         {/* {user.fullname} */}
//                     </Link>
//                     {/* <span className="score">{user.score?.toLocaleString()}</span> */}
//                     <button onClick={onLogout}>logout</button>
//                 </div>
//             )}
//         </nav>

//     </header>
// )
