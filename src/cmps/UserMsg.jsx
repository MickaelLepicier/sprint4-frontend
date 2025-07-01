import { eventBus, showSuccessMsg } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'
// import { socketService, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service'

export function UserMsg() {
  const [msg, setMsg] = useState(null)
  const timeoutIdRef = useRef()

  //   useEffect(() => {
  //     const unsubscribe = eventBus.on('show-msg', msg => {
  //       setMsg(msg)
  //       if (timeoutIdRef.current) {
  //         timeoutIdRef.current = null
  //         clearTimeout(timeoutIdRef.current)
  //       }
  //       timeoutIdRef.current = setTimeout(closeMsg, 3000)
  //     })

  //     // socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
  //     //     showSuccessMsg(`New review about me ${review.txt}`)
  //     // })

  //     return () => {
  //       unsubscribe()
  //       // socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
  //     }
  //   }, [])

  useEffect(() => {
    const unsubscribe = eventBus.on('show-msg', msg => {
      setMsg(msg)
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current) // <--- FIX: clear the old timeout FIRST!
      }
      timeoutIdRef.current = setTimeout(closeMsg, 3000)
    })

    return () => {
      unsubscribe()
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current) // <--- Clean up on unmount, too
    }
  }, [])

  function closeMsg() {
    setMsg(null)
  }

  function msgClass() {
    return msg ? 'visible' : ''
  }
  if (!msg) return null
  return (
    <section className={`user-msg ${msg?.type} ${msgClass()}`}>
      {/* <button onClick={closeMsg}>x</button> */}
      <div className="notification-msg">
        {msg?.imgUrl && (
          <span>
            <img src={msg?.imgUrl} alt="" />
          </span>
        )}
        <span>{msg?.txt}</span>
      </div>
    </section>
  )
}
