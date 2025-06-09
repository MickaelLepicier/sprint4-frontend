import { MediaPlayer } from './MediaPlayer/MediaPlayer'
import { SignUpFooter } from './SignUpFooter'
import { userService } from '../services/user'
import { useSelector } from 'react-redux'

export function AppFooter() {
  // TODOs:
  // [] get if user is login - yes <MediaPlayer /> , no - <SignupFooter />
  // [] create <SignupFooter />
  // []
  // []


  // const user = userService.getLoggedinUser()
  const user = useSelector(storeState => storeState.userModule.user)


  return (
    <footer className="app-footer full">
      {/* <MediaPlayer /> */}
      {user ? <MediaPlayer /> : <SignUpFooter />}
    </footer>
  )
}
