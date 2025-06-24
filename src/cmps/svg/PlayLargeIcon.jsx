export function PlayLargeIcon({ className = '', size = 24, color = 'currentColor', ...props }) {
    return (
        <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            className={`play-large-icon ${className}`.trim()}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            {...props}
        >
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
        </svg>
    )
}
