import { NavLink } from 'react-router'
import { AuthBtns } from './util/AuthBtns'

export function AuthFooter() {

  return (
    <section>
      <NavLink to="signup" className="auth-footer-container" >
        <div>
          <p>Preview of Spotify</p>
          <p>Sign up to get unlimited songs. No credit card needed.</p>
        </div>
        <AuthBtns isHeader={false} />
      </NavLink>
    </section>
  )
}
