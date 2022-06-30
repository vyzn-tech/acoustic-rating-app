import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridColumnMenuContainer,
  SortGridMenuItems,
  GridCsvExportOptions,
  useGridApiContext,
  GridValueFormatterParams,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid'

import { Button, ButtonProps, Stack, IconButton } from '@mui/material'

import { FileDownload, FilterList } from '@mui/icons-material'

import './result-data-grid.css'
import React from 'react'

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

const truncateColumnValue = (value: string, max: number) => {
  if (value.length > max) {
    return `${value.slice(0, max - 3)}...`
  }
  return value
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
    valueFormatter: (params: GridValueFormatterParams) => params.value || '-',
  },
  {
    field: 'airborneAcousticRatingCtrReq',
    headerName: 'AirborneAcousticRatingCtrReq',
    width: 250,
    valueFormatter: (params: GridValueFormatterParams) => params.value || '-',
  },
  {
    field: 'footstepAcousticRatingCReq',
    headerName: 'FootstepAcousticRatingCReq',
    width: 250,
    valueFormatter: (params: GridValueFormatterParams) => params.value || '-',
  },
  {
    field: 'footstepAcousticRatingCtrReq',
    headerName: 'FootstepAcousticRatingCtrReq',
    width: 250,
    valueFormatter: (params: GridValueFormatterParams) => params.value || '-',
  },
  {
    field: 'warning',
    headerName: 'Warning',
    width: 150,
    valueGetter: (params: GridValueGetterParams) => truncateColumnValue(`${params.row.warning || '-'}`, 40),
  },
]

export default function ResultDataGrid({ tableData }: ResultDataGridProps) {
  const CustomToolbar = (props: any) => {
    const gridApiRef = useGridApiContext()

    const handleExport = () => gridApiRef.current.exportDataAsCsv()
    const handleFilter = () => gridApiRef.current.showFilterPanel()

    // const buttonBaseProps: ButtonProps = {
    //   color: 'primary',
    //   size: 'small',
    //   startIcon: <FileDownloadIcon />,
    // }

    const FilterButton = () => {
      return (
        <IconButton title="Filter results" onClick={handleFilter}>
          <FilterList />
        </IconButton>
      )
    }

    return (
      <GridToolbarContainer {...props} sx={{ py: 2, px: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between" flex={1}>
          <GridToolbarQuickFilter placeholder="Search result table"></GridToolbarQuickFilter>

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton title="Filter results" onClick={handleFilter}>
              <FilterList />
            </IconButton>
            <IconButton title="Download as CSV" onClick={handleExport}>
              <FileDownload />
            </IconButton>
          </Stack>
        </Stack>

        <div>
          <GridToolbarFilterButton
            sx={{ px: 2 }}
            componentsProps={{
              button: {
                variant: 'outlined',
              },
            }}
          ></GridToolbarFilterButton>

          {/* <Button {...buttonBaseProps} onClick={() => handleFilter()} sx={{ px: 1 }}>
            Filter
          </Button>
          <Button {...buttonBaseProps} onClick={() => handleExport({})} sx={{ px: 1 }}>
            <FileDownloadIcon></FileDownloadIcon>
          </Button> */}
        </div>
      </GridToolbarContainer>
    )
  }

  const CustomColumnMenu = (props: any) => {
    const { hideMenu, currentColumn, open } = props

    return (
      <GridColumnMenuContainer hideMenu={hideMenu} currentColumn={currentColumn} open={open}>
        <SortGridMenuItems
          hideMenu={hideMenu}
          currentColumn={currentColumn}
          onClick={() => {
            return
          }}
          column={currentColumn}
        ></SortGridMenuItems>
      </GridColumnMenuContainer>
    )
  }

  if (tableData.length) {
    return (
      <div className="result-data-grid">
        <DataGrid
          components={{
            Toolbar: CustomToolbar,
            ColumnMenu: CustomColumnMenu,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
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
