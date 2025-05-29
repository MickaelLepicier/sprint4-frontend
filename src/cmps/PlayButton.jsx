import { FaPlay, FaPause } from 'react-icons/fa'
import { useSelector } from 'react-redux'

export function PlayButton({isPlaying, onToggle }) {
    // const isPlaying = useSelector((storeState) => storeState.systemModule.isPlaying)


  return (
    <button
      onClick={onToggle}
      className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all"
    >
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>
  )
}