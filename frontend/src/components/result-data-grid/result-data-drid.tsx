import { DataGrid, GridColDef, GridValueGetterParams, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'

import './result-data-grid.css'

type ResultItem = {
  id: string
  airborneAcousticRatingCReq: number | null
  airborneAcousticRatingCtrReq: number | null
  error: string | null
  footstepAcousticRatingCReq: number | null
  footstepAcousticRatingCtrReq: number | null
  warning: string | null
}

interface ResultDataGridProps {
  tableData: Array<ResultItem>
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'GUID',
    width: 150,
    valueGetter: (params: GridValueGetterParams) => parseInt(params.row.id),
  },
  {
    field: 'airborneAcousticRatingCReq',
    headerName: 'AirborneAcousticRatingCReq',
    width: 250,
    valueGetter: (params: GridValueGetterParams) => `${params.row.airborneAcousticRatingCReq || '-'}`,
  },
  {
    field: 'airborneAcousticRatingCtrReq',
    headerName: 'AirborneAcousticRatingCtrReq',
    width: 250,
    valueGetter: (params: GridValueGetterParams) => `${params.row.airborneAcousticRatingCtrReq || '-'}`,
  },
  {
    field: 'footstepAcousticRatingCReq',
    headerName: 'FootstepAcousticRatingCReq',
    width: 250,
    valueGetter: (params: GridValueGetterParams) => `${params.row.footstepAcousticRatingCReq || '-'}`,
  },
  {
    field: 'footstepAcousticRatingCtrReq',
    headerName: 'FootstepAcousticRatingCtrReq',
    width: 250,
    valueGetter: (params: GridValueGetterParams) => `${params.row.footstepAcousticRatingCtrReq || '-'}`,
  },
  {
    field: 'warning',
    headerName: 'Warning',
    width: 150,
    valueGetter: (params: GridValueGetterParams) => `${params.row.warning || '-'}`,
  },
]

export default function ResultDataGrid({ tableData }: ResultDataGridProps) {
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ justifyContent: 'flex-end', gap: 1 }}>
        <GridToolbarExport printOptions={{ disable: true }}></GridToolbarExport>
      </GridToolbarContainer>
    )
  }

  if (tableData.length) {
    return (
      <div className="result-data-grid">
        <DataGrid
          components={{
            Toolbar: CustomToolbar,
          }}
          rows={tableData}
          columns={columns}
          pageSize={50}
          getRowId={(r) => r.id}
          rowsPerPageOptions={[50]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    )
  }

  return <></>
}
