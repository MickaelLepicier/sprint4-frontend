import { useEffect, useState } from 'react'

export function useCompactCreateBtn(ref, threshold = 331) {
    const [isCompact, setIsCompact] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const update = () => {
            setIsCompact(el.offsetWidth <= threshold)
        }

        update() 

        const observer = new ResizeObserver(update)
        observer.observe(el)

        return () => observer.disconnect()
    }, [ref, threshold])

    return isCompact
}
