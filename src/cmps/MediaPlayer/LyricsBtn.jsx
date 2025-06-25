import { useNavigate, useLocation } from 'react-router-dom'
import { LyricsIcon } from '../svg/LyricsIcon'
import { SetTrackBtn } from '../SetTrackBtn'

export function LyricsBtn({ isDisabled }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isLyricsActive = location.pathname === '/lyrics'
  const activeClassName = isLyricsActive ? 'active-green' : ''

  function handleClick() {
    if (isLyricsActive) navigate(-1)
    else navigate('/lyrics')
  }

  return (
    <section style={isDisabled}>
      <SetTrackBtn
        className={`lyrics-btn ${activeClassName}`}
        onClick={handleClick}
        ariaLabel="Show Lyrics"
        title="Show Lyrics"
      />
    </section>
  )
}
