export function EmptyPlaylistIcon({ size = 24, color = 'currentColor', ...props }) {

    return (
          <div className="img-bg flex-center ">

        <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            className="empty-playlist-icon"
            data-testid="playlist"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            {...props}
        >
            <path
                d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5z"
                fill={color}
            />
        </svg>
        </div>
    )
}
