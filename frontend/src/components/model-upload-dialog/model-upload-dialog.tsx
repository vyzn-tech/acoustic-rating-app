import React from 'react'
import { Button, Modal, Box, Typography } from '@mui/material'
import ModelFileUpload from 'components/model-file-upload/model-file-upload'

import Strings from 'utils/Strings'
import './model-upload-dialog.css'

interface ModelUploadDialogProps {
  title: string
  description?: string
  open?: boolean
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onConfirm: (file: File) => void
}

export default function ModelUploadDialog({ title, description, open, onClose, onConfirm }: ModelUploadDialogProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const boxStyle = { p: 3, bgcolor: 'background.paper', boxShadow: 24 }

  const onConfirmClick = () => {
    if (!file) return

    onConfirm(file)
    setFile(null)
  }

  return (
    <Modal
      open={!!open}
      onClose={onClose}
      aria-labelledby="model-upload-dialog-title"
      aria-describedby="model-upload-dialog-description"
    >
      <Box className="model-upload-dialog-box" sx={boxStyle}>
        <Typography id="model-upload-dialog-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="model-upload-dialog-description" sx={{ mt: 1 }}>
          {description}
        </Typography>

        <ModelFileUpload onFileUpload={setFile} />

        <div className="model-upload-dialog-actions">
          <Button variant="outlined" component="span" onClick={onClose}>
            {Strings.ACOUSTIC_RATING_DIALOG_ABORT_BUTTON_LABEL}
          </Button>
          <Button variant="contained" disabled={!file} component="span" sx={{ ml: 1 }} onClick={onConfirmClick}>
            {Strings.ACOUSTIC_RATING_DIALOG_CONFIRMATION_BUTTON_LABEL}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
