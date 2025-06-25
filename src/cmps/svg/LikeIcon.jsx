export function LikeIcon({ size = 16, ...props }) {
  return (
    <svg
      className="add-icon"
      data-encore-id="icon"
      role="img"
      aria-hidden="true"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="10" x2="16" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="16" x2="22" y2="16" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
