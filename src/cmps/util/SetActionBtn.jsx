export function SetActionBtn({
  currIcon,
  addClassName = '',
  onClick = () => null,
  ariaLabel,
  title,
  dis = false,
  ...rest
}) {
  return (
    <button
      className={`btn-wrapper flex-center ${addClassName}`}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      disabled={dis}
      {...rest} 
    >
      {currIcon}
    </button>
  )
}
