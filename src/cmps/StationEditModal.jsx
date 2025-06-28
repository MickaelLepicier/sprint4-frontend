import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { updateStation, loadStations } from '../store/station/station.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { SpotifyLoader } from './SpotifyLoader'
import { ClearIcon } from './svg/ClearIcon'
import { EmptyPlaylistIcon } from './svg/EmptyPlaylistIcon'
import { PenIcon } from './svg/PenIcon'

export const StationEditModal = forwardRef((props, ref) => {
    // Refs
    const modalRef = useRef()
    const modalInputRef = useRef()
    const fileInputRef = useRef()

    // Expose openModal and closeModal functions to the parent component (SongList.jsx)
    // This lets the parent (e.g. SongList) control when the modal opens/closes 
    // by calling modalRef.current.openModal() or modalRef.current.closeModal()
    useImperativeHandle(ref, () => ({
        openModal: onOpenModal
    }))
    
    // Redux
    const station = useSelector(store => store.stationModule.station)
    const user = useSelector(store => store.userModule.user)

    // State
    const [stationToUpdate, setStationToUpdate] = useState(station)
    const [previewImg, setPreviewImg] = useState(station.imgUrl || '')
    const [imageFile, setImageFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Handlers
    async function onHandleChange({ target }) {
        const { name, value } = target
        setStationToUpdate(prevStation => ({ ...prevStation, [name]: value }))
    }

    // Mimic Spotify behavior - if user tries to save with same station name
    // then select the title input
    function handleKeyDown(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault()

            if (stationToUpdate?.name === station?.name) {
                modalInputRef.current?.select()
            } else {
                onSubmitChange(ev)
            }
        }
    }
    
    function handleFileChange(ev) {
        console.log('hola')
        const file = ev.target.files[0]
        if (!file) return

        setImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setPreviewImg(reader.result)
        reader.readAsDataURL(file)
    }

    async function uploadImage(file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'spotify_cloudinary')

        const res = await fetch('https://api.cloudinary.com/v1_1/dirlnkakz/image/upload', {
            method: 'POST',
            body: formData,
        })

        const data = await res.json()
        return data.secure_url
    }

    async function onSubmitChange(ev) {
        ev.preventDefault()
        setIsLoading(true)

        try {
            let updatedImgUrl = stationToUpdate.imgUrl
            if (imageFile) {
                updatedImgUrl = await uploadImage(imageFile)
            }

            const updatedStation = {
                ...stationToUpdate,
                imgUrl: updatedImgUrl,
            }

            await updateStation(updatedStation)
            // await loadStations()
            modalRef.current?.close()
            // showSuccessMsg('Station updated successfully')
        } catch (error) {
            console.error('[submit] Error:', error)
            showErrorMsg('Could not update station')
        } finally {
            setIsLoading(false)
        }
    }

    function onCloseModal() {
        if (modalRef.current) modalRef.current.close()
    } 

    function onOpenModal() {
        if (station._id === user.likedSongsStationId) return
        
        setStationToUpdate({ ...station })
        setImageFile(null)
        
        setPreviewImg(station.imgUrl || '')
        
        if (modalRef.current) modalRef.current.showModal()
    }

    return (
        <dialog className="edit-station-modal" ref={modalRef}>
            {/* Modal header */}
            <div className="modal-header">
                <h1 className="">Edit details</h1>
                
                <button className="modal-close-btn" onClick={onCloseModal}>
                    <ClearIcon />
                </button>
            </div>

            {/* Modal body */}
            <div className="modal-body">
                {/* Image container */}
                <div className="album-image-container">
                    <button className="upload-image-btn" onClick={() => fileInputRef.current?.click()}>
                        {previewImg &&  (
                            // Show album cover image when there is
                            <div className="img-wrapper">
                                <img src={previewImg} alt="Station cover" className="station-img" />

                                {isLoading && <div className="loader-overlay"><SpotifyLoader /></div>}
                            </div>
                        )} 

                        {/* Musical note icon over dark background when no album cover image */}
                        {!previewImg && !isLoading && (
                            <div className="icon-layer">
                                <EmptyPlaylistIcon size={48} />
                            </div>
                        )}
                        
                        {/* Pen icon and 'Choose photo' text on hover */}
                        {!isLoading && (
                            <div className="hover-layer">
                                <PenIcon size={48} />
                                <span>Choose photo</span>
                            </div>
                        )}
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            
                {/* Station title input */}
                <div className="title-field">
                    <label htmlFor="station-name">Name</label>
                    <input
                        ref={modalInputRef}
                        id="station-name"
                        name="name"
                        type="text"
                        value={stationToUpdate?.name || ''}
                        placeholder="Add a name"
                        maxlength="100"
                        autoComplete="off"
                        required
                        onChange={onHandleChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* Station description textarea */}
                <div className="description-field">
                    <label htmlFor="station-description">Description</label>
                    <textarea
                        id="station-description"
                        name="description"
                        value={stationToUpdate?.description || ''}
                        maxlength="300"
                        onChange={onHandleChange}
                        placeholder="Add an optional description"
                        autoComplete="off"
                        onKeyDown={(ev) => {if (ev.key === 'Enter') ev.preventDefault()}}
                    />
                </div>

                {/* Save station edit changes button */}
                <button     
                    type="submit"
                    onClick={onSubmitChange}
                    disabled={!!isLoading}
                    className={`save-btn ${isLoading ? 'not-allowed' : ''}`}
                >
                    <span>Save</span>
                </button>

                {/* MiserBeat disclaimer text */}
                <p className="disclaimer-txt" style={{ gridArea: 'disclaimer' }}>
                    By proceeding, you agree to give MisterBeat access to the image you choose to upload. Please make sure you have the right to upload the image.
                </p>
            </div>
        </dialog>
    )
})