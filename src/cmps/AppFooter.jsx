import { MediaPlayer } from './MediaPlayer/MediaPlayer'
import { AuthFooter } from './AuthFooter'
import { userService } from '../services/user'
import { useSelector } from 'react-redux'

export function AppFooter() {
  // const user = userService.getLoggedinUser()
  const user = useSelector(storeState => storeState.userModule.user)

  const bgColor = user ? 'black' : 'linear-gradient(90deg, #af2896, #509bf5)'
  
  return (
    <footer className="app-footer full" style={{background: bgColor}}>
      {user ? <MediaPlayer /> : <AuthFooter />}
    </footer>
  )
}
