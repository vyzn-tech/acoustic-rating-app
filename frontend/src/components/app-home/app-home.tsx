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

    const externalAcousticRatingPartial =
      '?external-acoustic-ratings[n][day]=62&external-acoustic-ratings[n][night]=55&external-acoustic-ratings[ne][day]=62&external-acoustic-ratings[ne][night]=55&external-acoustic-ratings[e][day]=0&external-acoustic-ratings[e][night]=0&external-acoustic-ratings[se][day]=0&external-acoustic-ratings[se][night]=0&external-acoustic-ratings[s][day]=0&external-acoustic-ratings[s][night]=0&external-acoustic-ratings[sw][day]=0&external-acoustic-ratings[sw][night]=0&external-acoustic-ratings[w][day]=0&external-acoustic-ratings[w][night]=0&external-acoustic-ratings[nw][day]=0&external-acoustic-ratings[nw][night]=0'

    fetch(`http://dev.dbs-acoustic-rating.docker/api/calculate${externalAcousticRatingPartial}`, {
      method: 'POST',
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
