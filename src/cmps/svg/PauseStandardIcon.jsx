export function PauseStandardIcon({ className = '', size = 16, color = 'currentColor', ...props }) {
    return (
        <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            className={`pause-standard-icon ${className}`.trim()}
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill={color}
            {...props}
        >
            <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"></path>
        </svg>
    )
}
