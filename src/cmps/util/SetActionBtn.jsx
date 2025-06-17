export function SetActionBtn({ currIcon, addClassName = '', onClick = () => null, dis = false }) {
  // the addClassName is for the button size

  // TODO- add style to button element
  // INSTEAD OF IMG-WRAPPER => ICON-WRAPPER
  // add icon-wrapper

  // const style = {
  //   width: '32px',
  //   height: '32px'
  // }
  return (
    <button className={`btn-wrapper ${addClassName}`} onClick={onClick} disabled={dis}>
      {currIcon}
    </button>
  )
}
