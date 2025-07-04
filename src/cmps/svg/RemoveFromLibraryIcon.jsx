export function RemoveFromLibraryIcon({ size = 16, color = 'currentColor', ...props }) {
    return (
        <svg
            className="remove-from-library-icon"
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill="none"
            {...props}
        >
            <path
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z"
                fill={color}
            />
        </svg>
        )
}
