import { useEffect, useState } from 'react'
import { FastAverageColor } from 'fast-average-color'

export function useLyricsColors(imgUrl) {
    const [colors, setColors] = useState({
        background: '#333333',
        text: '#fff'
    })

    useEffect(() => {
        if (!imgUrl) return

        const img = new window.Image()
        img.crossOrigin = 'Anonymous'
        img.src = imgUrl

        img.onload = () => {
            try {
                const fac = new FastAverageColor()
                const { value } = fac.getColor(img)
                // value: [r, g, b, a]
                // Compose CSS rgb string
                const [r, g, b] = value
                const background = `rgb(${r}, ${g}, ${b})`
                // Good contrast text color
                const luminance = (0.299*r + 0.587*g + 0.114*b) / 255
                const text = luminance > 0.5 ? '#222' : '#eee'
                setColors({ background, text })
                console.log('[useLyricsColors]', { avg: value, background, text })
            } catch (err) {
                setColors({ background: '#191414', text: '#eee' })
                console.error('Color extraction failed:', err)
            }
        }
        img.onerror = (e) => {
            setColors({ background: '#191414', text: '#eee' })
            console.error('Image failed to load:', e)
        }
        return () => { img.onload = null; img.onerror = null }
    }, [imgUrl])

    return colors
}
