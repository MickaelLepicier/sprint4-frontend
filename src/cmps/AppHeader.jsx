import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/user/user.actions'
import { StationFilter } from './StationFilter'
import { useState } from 'react'

// TODOs:
// scss- backgroundColor - #121212
// scss - make the Home and the filter in the middle
// add logo img
// add functionality 


export function AppHeader() {
    const user = useSelector(storeState => storeState.userModule.user)
    const [filterBy, setFilterBy] = useState({txt:''}) // TODO instead of {txt:''}, getFilterDefault()
    const navigate = useNavigate()

    async function onLogout() {
        try {
            await logout()
            navigate('/')
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    function onSetFilterBy(filterBy){
        setFilterBy(filterBy)
    }

    return (
        <header className="app-header main-container full">
          
            <nav className=''>
                <NavLink to="/home" className="/logo">
                <img src="../img/logo/logo.png" alt="Logo" className="logo-img" />  
                </NavLink>

                <NavLink to="/home">Home</NavLink>
               
               {/* Center Section: Filter */}
                <StationFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy}/>

                {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

                {!user && (
                    <div className="user-info">
                    <NavLink to="signup" className="signup-link">Sign up</NavLink>
                    <NavLink to="login" className="login-link">Login</NavLink>
                    </div>
                    )}

                {user && (
                    <div className="user-info">
                        <Link to={`user/${user._id}`}>
                            {user.imgUrl && <img src={user.imgUrl} />}
                            {/* {user.fullname} */}
                        </Link>
                        {/* <span className="score">{user.score?.toLocaleString()}</span> */}
                        <button onClick={onLogout}>logout</button>
                    </div>
                )}
            </nav>


        </header >
    )
}
