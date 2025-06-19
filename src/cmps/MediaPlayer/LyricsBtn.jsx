import { useNavigate, useLocation } from 'react-router-dom'
import { LyricsIcon } from '../svg/LyricsIcon'
import { SetTrackBtn } from '../SetTrackBtn'

export function LyricsBtn()  {
    const navigate = useNavigate()
    const location = useLocation()
    const isLyricsActive = location.pathname === '/lyrics' 
    const activeClassName = isLyricsActive ? 'active-green' : ''

    function handleClick() {
        if (isLyricsActive) navigate(-1)
        else navigate('/lyrics')
    }

    return (
        <SetTrackBtn className={`lyrics-btn ${activeClassName}`} onClick={handleClick} ariaLabel="Show Lyrics" title="Show Lyrics" />

        // <button
        //     className={`lyrics-btn${isLyricsActive ? ' active' : ''}`}
        //     onClick={handleClick}
        //     aria-label="Show Lyrics"
        //     title="Show Lyrics"
        // >

        //     <LyricsIcon
        //         className="lyrics-img"
        //         style={{
        //             fill: isLyricsActive ? '#1DB954' : '#b3b3b3',
        //             width: 16,
        //             height: 16,
        //         }}
        //     />
        // </button>
    )
}
