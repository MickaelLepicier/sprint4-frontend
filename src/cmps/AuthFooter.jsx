import { NavLink } from 'react-router'
import { AuthBtns } from './util/AuthBtns'

export function AuthFooter() {
  const bgColor = 'linear-gradient(90deg, #af2896, #509bf5)'
  
  return (
    <section style={{background: bgColor}}>
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
