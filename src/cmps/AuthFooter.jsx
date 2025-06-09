import { AuthBtns } from './util/AuthBtns'

export function AuthFooter() {
  //   const bgColor = 'background-image: linear-gradient(90deg, #af2896, #509bf5);'

  return (
    <section className="auth-footer-container">
      <div>
        <p>Preview of Spotify</p>
        <p>Sign up to get unlimited songs. No credit card needed.</p>
      </div>
      <AuthBtns isHeader={false} />
    </section>
  )
}
