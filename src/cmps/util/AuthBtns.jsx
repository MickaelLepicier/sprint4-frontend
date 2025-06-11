import { NavLink, useNavigate } from 'react-router'
import { logout } from '../../store/user/user.actions'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'

export function AuthBtns({ user, isHeader = true }) {
  return isHeader ? <HeaderAuthButs user={user} /> : <FooterAuthLink />
}

function HeaderAuthButs({ user }) {
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

  return (
    <section className="auth-header">
      {user ? (
        <button className="btn-logout" onClick={onLogout}>
          <span className="btn-span">Logout</span>
        </button>
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
