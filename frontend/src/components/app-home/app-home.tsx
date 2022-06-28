import React from 'react'
import { Button } from '@mui/material'
import ResultDataGrid from 'components/result-data-grid/result-data-drid'
import ModelUploadDialog from 'components/model-upload-dialog/model-upload-dialog'

import Strings from 'utils/Strings'
import 'components/app-home/app-home.css'

export default function AppHome() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [tableData, setTableData] = React.useState([])

  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  const calculateAcousticRating = (file: File) => {
    setIsDialogOpen(false)
    readFileAsBinary(file, fetchResultFromApi)
  }

  const readFileAsBinary = (file: File, fn: (r: string | ArrayBuffer) => void) => {
    const reader = new FileReader()
    reader.onload = () => {
      const { result } = reader
      result && fn(result)
    }
    reader.readAsBinaryString(file as Blob)
  }

  const fetchResultFromApi = (fileResult: string | ArrayBuffer) => {
    const formData = new FormData()
    formData.append('file', new Blob([fileResult], { type: 'text/csv' }))

    fetch('/api/calculate', {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setTableData(data)
      })
  }

  return (
    <>
      <ModelUploadDialog
        title={Strings.ACOUSTIC_RATING_DIALOG_TITLE}
        description={Strings.ACOUSTIC_RATING_DIALOG_DESCRIPTION}
        open={isDialogOpen}
        onClose={closeDialog}
        onConfirm={calculateAcousticRating}
      />

      <div className="acoustic-rating-content">
        <div className="acoustic-rating-header">
          <span>{Strings.ACOUSTIC_RATING_TITLE}</span>
          <Button variant="contained" size="small" onClick={openDialog}>
            {Strings.ACOUSTIC_RATING_BUTTON_LABEL}
          </Button>
        </div>

        <ResultDataGrid tableData={tableData} />
      </div>
    </>
  )
}
