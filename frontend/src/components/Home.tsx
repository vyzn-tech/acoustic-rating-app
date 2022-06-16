import { Button, Modal, Box, Typography, Input } from '@mui/material'
import React from 'react'
import Strings from 'utils/Strings'
import { CloudUpload, CloudCircle } from '@mui/icons-material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import 'components/home.css'
import ResultJson from 'utils/result'

export default function Home() {
  const [open, setOpen] = React.useState(false)
  const [file, setFile] = React.useState<Partial<File | null>>()
  const [showTable, setShowTable] = React.useState(Boolean)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const downloadResult = (data: any) => {
    const blob = new Blob([data], { type: 'text/csv' })
    const a = document.createElement('a')

    a.href = window.URL.createObjectURL(blob)
    a.download = 'acoustic-rating-result.csv'
    a.click()
    window.URL.revokeObjectURL(a.href)
  }

  const onChange = (file: File) => {
    if (file) {
      setFile(file)
    }
  }

  const readFileAsBinary = () => {
    setShowTable(true)
    setOpen(false)
    // const reader = new FileReader()
    // reader.onload = () => {
    //   if (reader.result) {

    //     calculateAcousticRating(reader.result)
    //   }
    // }
    // reader.readAsBinaryString(file as Blob)
  }

  const calculateAcousticRating = (fileResult: string | ArrayBuffer) => {
    const formData = new FormData()
    formData.append('file', new Blob([fileResult], { type: 'text/csv' }))

    fetch('/api/calculate', {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    })
      .then((response) => response.text())
      .then((readableText) => {
        downloadResult(readableText)
      })
  }

  const removeFile = () => {
    setFile(null)
  }

  const boxStyle = { p: 3, bgcolor: 'background.paper', boxShadow: 24 }

  const noFileTemplate = () => {
    return (
      <div className="modal-upload-container">
        <CloudUpload className="icon extra-large"></CloudUpload>
        <Typography sx={{ mb: 1 }}>{Strings.ACOUSTIC_RATING_UPLOAD_LABEL}</Typography>

        <label htmlFor="contained-button-file">
          <Input accept=".csv" id="contained-button-file" type="file" onChange={(e) => onChange(e.target.files[0])} />
          <Button variant="contained" component="span">
            {Strings.ACOUSTIC_RATING_DIALOG_UPLOAD_BUTTON_LABEL}
          </Button>
        </label>
      </div>
    )
  }

  const fileTemplate = () => {
    return (
      <div className="modal-upload-container">
        <CloudCircle className="icon extra-large" color="success"></CloudCircle>
        <div>
          <span>{file.name}</span>
          <Button variant="text" onClick={removeFile} sx={{ ml: 1 }}>
            {Strings.ACOUSTIC_RATING_DIALOG_REMOVE_FILE_BUTTON_LABEL}
          </Button>
        </div>
      </div>
    )
  }

  const getDataGridTemplate = () => {
    return (
      <div style={{ height: 600, width: '100%', marginTop: '2rem' }}>
        <DataGrid
          rows={ResultJson}
          columns={columns}
          pageSize={50}
          getRowId={(a) => a.GUID}
          rowsPerPageOptions={[50]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    )
  }

  const columns: GridColDef[] = [
    { field: 'GUID', headerName: 'GUID', width: 150 },
    {
      field: 'AirborneAcousticRatingCReq',
      headerName: 'AirborneAcousticRatingCReq',
      width: 250,
      valueGetter: (params: GridValueGetterParams) => `${params.row.AirborneAcousticRatingCReq || '-'}`,
    },
    {
      field: 'AirborneAcousticRatingCtrReq',
      headerName: 'AirborneAcousticRatingCtrReq',
      width: 250,
      valueGetter: (params: GridValueGetterParams) => `${params.row.AirborneAcousticRatingCReq || '-'}`,
    },
    {
      field: 'FootstepAcousticRatingCReq',
      headerName: 'FootstepAcousticRatingCReq',
      width: 250,
      valueGetter: (params: GridValueGetterParams) => `${params.row.AirborneAcousticRatingCReq || '-'}`,
    },
    {
      field: 'FootstepAcousticRatingCtrReq',
      headerName: 'FootstepAcousticRatingCtrReq',
      width: 250,
      valueGetter: (params: GridValueGetterParams) => `${params.row.AirborneAcousticRatingCReq || '-'}`,
    },
    {
      field: 'Warning',
      headerName: 'Warning',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => `${params.row.AirborneAcousticRatingCReq || '-'}`,
    },
  ]

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-content-container" sx={boxStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {Strings.ACOUSTIC_RATING_DIALOG_TITLE}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            {Strings.ACOUSTIC_RATING_DIALOG_DESCRIPTION}
          </Typography>

          {!file && noFileTemplate()}
          {file && fileTemplate()}

          <div className="modal-actions-container">
            <Button variant="outlined" component="span" onClick={handleClose}>
              {Strings.ACOUSTIC_RATING_DIALOG_ABORT_BUTTON_LABEL}
            </Button>
            <Button variant="contained" component="span" sx={{ ml: 1 }} disabled={!file} onClick={readFileAsBinary}>
              {Strings.ACOUSTIC_RATING_DIALOG_CONFIRMATION_BUTTON_LABEL}
            </Button>
          </div>
        </Box>
      </Modal>

      <div className="acoustic-rating-content">
        <div className="acoustic-rating-header">
          <span>{Strings.ACOUSTIC_RATING_TITLE}</span>
          <Button variant="contained" size="small" onClick={handleOpen}>
            {Strings.ACOUSTIC_RATING_BUTTON_LABEL}
          </Button>
        </div>

        {showTable && getDataGridTemplate()}
      </div>
    </React.Fragment>
  )
}
