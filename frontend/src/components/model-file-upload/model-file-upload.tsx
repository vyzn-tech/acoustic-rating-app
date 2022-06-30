import React from 'react'
import { Button, Typography, Input } from '@mui/material'
import { CloudUpload, CloudDone } from '@mui/icons-material'

import Strings from 'utils/Strings'
import './model-file-upload.css'

interface ModelFileUploadProps {
  onFileUpload: (file: File | null) => void
}

export default function ModelFileUpload({ onFileUpload }: ModelFileUploadProps) {
  const [file, setFile] = React.useState<File | null>(null)

  const loadUploadedFile = (e: React.ChangeEvent) => {
    const element = e.target as HTMLInputElement
    const files = element.files as FileList
    if (files.length) {
      setFile(files[0])
      onFileUpload(files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    onFileUpload(null)
  }

  const FileUploadedTemplate = () => {
    return (
      <>
        <CloudDone className="icon extra-large" color="success"></CloudDone>
        <div>
          <span>{file?.name}</span>
          <Button variant="text" onClick={removeFile} sx={{ ml: 1 }}>
            {Strings.ACOUSTIC_RATING_DIALOG_REMOVE_FILE_BUTTON_LABEL}
          </Button>
        </div>
      </>
    )
  }

  const FileUploadTemplate = () => {
    return (
      <>
        <CloudUpload className="icon extra-large"></CloudUpload>
        <Typography sx={{ mb: 1 }}>{Strings.ACOUSTIC_RATING_UPLOAD_LABEL}</Typography>

        <label htmlFor="model-file-upload-input">
          <Input inputProps={{ accept: '.csv' }} id="model-file-upload-input" type="file" onChange={loadUploadedFile} />
          <Button variant="contained" component="span">
            {Strings.ACOUSTIC_RATING_DIALOG_UPLOAD_BUTTON_LABEL}
          </Button>
        </label>
      </>
    )
  }

  return <div className="model-file-upload-container">{file ? FileUploadedTemplate() : FileUploadTemplate()}</div>
}
