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

  // const elLogOut = (
  //   <span className="login-btn-inner" onClick={onLogout}>
  //     Logout
  //   </span>
  // )

  return (
    <section className="auth-header">
      {user ? (
        // <button className="login-btn-inner" onClick={onLogout}>
        <button className="btn-logout" onClick={onLogout}>
       <span className="btn-login-inner">Logout</span>
      </button>
      ) : (
        <>
          {/* <NavLink to="signup" className="signup-btn"> */}
          <NavLink to="signup" className="btn-signup">
            Sign up
          </NavLink>
          {/* <NavLink to="login" className="login-btn"> */}
          <NavLink to="login" className="btn-login">
            {/* <span className="login-btn-inner">Login</span> */}
            <span className="btn-login-inner">Login</span>
          </NavLink>
        </>
      )}
    </section>
  )
}

function FooterAuthLink() {
  return (
    // <NavLink to="signup" className="signup-btn" >
    //     <span className="login-btn-inner">Sign up</span>
    // </NavLink>

    <NavLink to="signup" className="btn-footer-signup" >
      <span className="btn-login-inner"> Sign up free</span>
    </NavLink>

  )
}
