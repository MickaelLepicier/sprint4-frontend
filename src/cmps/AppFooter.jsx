import { MediaPlayer } from './MediaPlayer/MediaPlayer'
import { AuthFooter } from './AuthFooter'
import { userService } from '../services/user'
import { useSelector } from 'react-redux'

export function AppFooter() {
  const user = useSelector(storeState => storeState.userModule.user)

  return (
    <footer className="app-footer full" >
      {user ? <MediaPlayer /> : <AuthFooter />}
    </footer>
  )
}
