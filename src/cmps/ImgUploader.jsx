import { useState } from 'react'
import { uploadService } from '../services/upload.service'

export function ImgUploader({ onUploaded }) {
  const [imgData, setImgData] = useState({
    imgUrl: `https://img.freepik.com/premium-photo/single-white-musical-note-black-background_14117-574607.jpg`,
    height: 500,
    width: 500,
  })

  const [isUploading, setIsUploading] = useState(false)

  async function uploadImg(ev) {
    setIsUploading(true)
    const { secure_url, height, width } = await uploadService.uploadImg(ev)

    setImgData({ imgUrl: secure_url, width, height })
    setIsUploading(false)
    onUploaded && onUploaded(secure_url)
  }

  function getUploadLabel() {
    // if (imgData.imgUrl) return 'Upload Another?'
    return isUploading ? 'Uploading....' : 'Upload Image'
  }

  return (
    <div className="upload-preview">
      <label htmlFor="imgUpload">
        {getUploadLabel()}
        {imgData.imgUrl && <img src={imgData.imgUrl} />}
      </label>
      <input hidden type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
    </div>
  )
}
