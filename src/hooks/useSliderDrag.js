import { useRef, useState } from 'react'

export function useSliderDrag({ max = 100, onChange }) {
  const containerRef = useRef(null)
  const [previewValue, setPreviewValue] = useState(null)

  const isDragging = previewValue !== null
  const currentValue = (externalValue) => (isDragging ? previewValue : externalValue)

  function getRatioFromEvent(e) {
    if (!containerRef.current) return 0
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    return Math.max(0, Math.min(1, x / rect.width))
  }

  function handleMouseDown(ev) {
    ev.preventDefault()

    const update = (e) => {
      const ratio = getRatioFromEvent(e)
      const newValue = ratio * max
      setPreviewValue(newValue)
    }

    const finish = () => {
      if (previewValue !== null && typeof onChange === 'function') {
        onChange(previewValue)
      }
      setPreviewValue(null)
      window.removeEventListener('mousemove', update)
      window.removeEventListener('mouseup', finish)
    }

    window.addEventListener('mousemove', update)
    window.addEventListener('mouseup', finish)
  }

  function handleClick(ev) {
    const ratio = getRatioFromEvent(ev)
    const newValue = ratio * max
    if (typeof onChange === 'function') onChange(newValue)
  }

  return {
    containerRef,
    currentValue,
    handleMouseDown,
    handleClick
  }
}
