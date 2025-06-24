export function PauseLargeIcon({ className = '', size = 24, color = 'currentColor', ...props }) {
    return (
        <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            className={`pause-large-icon ${className}`.trim()}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            {...props}
        >
            <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7z"></path>
        </svg>
    )
}
