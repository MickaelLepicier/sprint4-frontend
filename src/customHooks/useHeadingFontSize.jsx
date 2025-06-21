import { useEffect, useState } from 'react'

const FONT_SIZES = ['6rem', '4.5rem', '3rem', '2rem']

// Receive element useRef and their dependencies (i.e. station.name)
export function useHeadingFontSize(ref, deps = []) {
    const [fontSize, setFontSize] = useState(FONT_SIZES[0])

    useEffect(() => {
        const el = ref.current
        if (!el) return

        for (const size of FONT_SIZES) {
            el.style.fontSize = size
            if (el.scrollWidth <= el.clientWidth) {
                setFontSize(size)
                break
            }
        }
    }, deps)

    return fontSize
}
