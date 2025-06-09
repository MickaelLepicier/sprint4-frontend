import { useState } from 'react'

export function ImageWithFallback({ src, alt, fallback, ...props }) {
    const [error, setError] = useState(false)

    function handleLoad(e) {
        if (e.target.naturalWidth === 161 && e.target.naturalHeight === 81) {
            setError(true)
        }
    }

    if (!src || error) return fallback

    return (
        <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            onLoad={handleLoad}
            {...props}
        />
    )
}
