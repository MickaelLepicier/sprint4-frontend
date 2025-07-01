import { NavLink, useNavigate } from 'react-router'
import { logout } from '../../store/user/user.actions'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { useState, useRef, useEffect } from 'react'

export function AuthBtns({ user, isHeader = true }) {
  return isHeader ? <HeaderAuthButs user={user} /> : <FooterAuthLink />
}

function HeaderAuthButs({ user }) {
  const navigate = useNavigate()
  const [isOpenModal, setIsOpenModal] = useState(false)

  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      console.log('event:', menuRef.current.contains(event.target))
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpenModal(false)
      }
    }

    if (isOpenModal) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpenModal])

  function showUserModal(isOpen) {
    setIsOpenModal(isOpen)
  }

  async function onLogout() {
    try {
      await logout()
      navigate('/')
      // showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg('Cannot logout')
    }
  }

  return (
    <section className="auth-header">
      {user ? (
        <div className="flex">
          {/* <button className="btn-logout" onClick={onLogout}>
            <span className="btn-span">Logout</span>
          </button> */}
          <div className="menu-modal" ref={menuRef}>
            <button
              className="user-icon"
              onClick={() => {
                showUserModal(!isOpenModal)
              }}
            >
              <span className="user-name" title={user.fullname}>
                {user.fullname.substring(0, 1)}
              </span>
            </button>{' '}
            {/*maybe another div around btn*/}
            {isOpenModal && (
              <ul className="user-menu">
                <li className="user-logout" onClick={onLogout}>
                  Log out
                </li>
              </ul>
            )}
          </div>
        </div>
      ) : (
        <>
          <NavLink to="signup" className="btn-signup">
            Sign up
          </NavLink>
          <NavLink to="login" className="btn-login">
            <span className="btn-span">Log in</span>
          </NavLink>
        </>
      )}
    </section>
  )
}

function FooterAuthLink() {
  return (
    <NavLink to="signup" className="btn-footer-signup">
      <span className="btn-span"> Sign up free</span>
    </NavLink>
  )
}
