import { useState } from 'react'
import { auth, storage, STATE_CHANGED } from '@lib/config/firebase'
import Loader from '@components/Loader'

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadURL, setDownlodURL] = useState(null)

  // Creates a Firebase Upload Task
  const uploadFile = async e => {
    // Get the file
    const file = Array.from(e.target.files)[0]
    const extension = file.type.split('/')[1]

    // Makes reference to the storage bucket location
    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    )
    setUploading(true)

    // Starts the upload
    const task = ref.put(file)
    task.on(STATE_CHANGED, snapshot => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0)

      setProgress(pct)
      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      task
        .then(_d => ref.getDownloadURL())
        .then(url => {
          setDownlodURL(url)
          setUploading(false)
        })
    })
  }

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <label className="btn">
          📸 Upload Img
          <input
            type="file"
            onChange={uploadFile}
            accept="image/x-png,image/gif,image/jpeg"
          />
        </label>
      )}

      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  )
}
