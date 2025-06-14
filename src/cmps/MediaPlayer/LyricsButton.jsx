import { useNavigate, useLocation } from 'react-router-dom'
import { LyricsIcon } from '../svg/LyricsIcon'

export function LyricsButton() {
    const navigate = useNavigate()
    const location = useLocation()
    const isLyricsActive = location.pathname === '/lyrics'

    function handleClick() {
        if (isLyricsActive) navigate(-1)
        else navigate('/lyrics')
    }

    return (
        <button
            className={`lyrics-btn${isLyricsActive ? ' active' : ''}`}
            onClick={handleClick}
            aria-label="Show Lyrics"
            title="Show Lyrics"
        >
            <LyricsIcon
                className="lyrics-img"
                style={{
                    fill: isLyricsActive ? '#1DB954' : '#b3b3b3',
                    width: 16,
                    height: 16,
                }}
            />
        </button>
    )
}
