import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { AppService } from './app.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiFile } from './api-file.decorator'
import { ApiTags } from '@nestjs/swagger'
import { stringify } from 'csv-stringify/sync'
import { parseCSV } from 'csv-load-sync'

import {
  ALL_PREDEFINED_TYPES,
  IFCBuilding,
  IFCDoor,
  IFCItem,
  IFCRoof,
  IFCSlab,
  IFCSpace,
  IFCWall,
  IFCZone,
  PREDEFINED_TYPE_FLOOR,
  AcousticRatingCalculator,
  ExternalAcousticRatingCollection,
  ExternalAcousticRating,
  PREDEFINED_TYPE_ROOF,
  IFCFlatRoof,
} from '../libs/acoustic-rating-calculator/src/calculator'
import { isString } from 'lodash'
import { createReadStream } from 'fs'
import * as fs from 'fs'

const csvMimeTypes = [
  'application/csv',
  'application/x-csv',
  'text/csv',
  'text/comma-separated-values',
  'text/x-comma-separated-values',
]

const multerOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (csvMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${file.originalname}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      )
    }
  },
}

@Controller()
@ApiTags('dbs-acoustic-rating')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiFile()
  @Post('calculate')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  calculate(
    @UploadedFile() file: Express.Multer.File,
    @Response({ passthrough: true }) res,
  ): StreamableFile {
    const records = parseCSV(file.buffer.toString())
    const externalAcousticRatings = new ExternalAcousticRatingCollection(
      new ExternalAcousticRating(62, 55),
      new ExternalAcousticRating(0, 0),
      new ExternalAcousticRating(0, 0),
      new ExternalAcousticRating(0, 0),
      new ExternalAcousticRating(0, 0),
      new ExternalAcousticRating(0, 0),
      new ExternalAcousticRating(0, 0),
      new ExternalAcousticRating(0, 0),
    )
    const ifcItems = this.buildIFCItems(records)
    const calculator = new AcousticRatingCalculator(
      ifcItems,
      externalAcousticRatings,
    )
    calculator.calculate()

    const outputCsvAsString = stringify(ifcItems)
    const tmpFileName = Date.now() + '.csv'
    const tmpFilePath = 'tmp/' + tmpFileName
    fs.writeFileSync(tmpFilePath, outputCsvAsString)
    const response_file = createReadStream(tmpFilePath)

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment filename=output.csv',
    })
    return new StreamableFile(response_file)
  }

  buildIFCItems(rows): IFCItem[] {
    const ifcItems: IFCItem[] = []
    for (const row of rows) {
      switch (row.Entity.toLowerCase()) {
        case 'ifcbuilding':
          ifcItems.push(this.buildIFCBuilding(row))
          continue
        case 'ifcdoor':
          ifcItems.push(this.buildIFCDoor(row))
          continue
        case 'ifcroof':
          ifcItems.push(this.buildIFCRoof(row))
          continue
        case 'ifcspace':
          ifcItems.push(this.buildIFCSpace(row))
          continue
        case 'ifcwall':
          ifcItems.push(this.buildIFCWall(row))
          continue
        case 'ifczone':
          ifcItems.push(this.buildIFCZone(row))
          continue
      }

      if (row.Entity.toLowerCase() === 'ifcslab') {
        if (row.PredefindedType === PREDEFINED_TYPE_ROOF) {
          ifcItems.push(this.buildIFCFlatRoof(row))
          continue
        }
        ifcItems.push(this.buildIFCSlab(row))
      }
    }
    return ifcItems
  }

  setCommonIFCItemAttributes<T extends IFCItem>(row, iFCItem): T {
    let parentIds = []
    parentIds = row.ParentIds.replace(/ /g, '').split(',')
    iFCItem.id = row.GUID
    iFCItem.parentIds = parentIds

    return iFCItem
  }

  setIFCComponentAttributes<T extends IFCItem>(row, iFCItem): T {
    iFCItem.isExternal = row.IsExternal.toLowerCase() === 'true'
    iFCItem.celestialDirection = row.CelestialDirection

    return iFCItem
  }

  buildIFCWall(row): IFCWall {
    let iFCItem: IFCWall = new IFCWall()
    iFCItem = this.setCommonIFCItemAttributes(row, iFCItem)
    iFCItem = this.setIFCComponentAttributes(row, iFCItem)

    return iFCItem
  }

  buildIFCDoor(row): IFCDoor {
    let iFCItem: IFCDoor = new IFCDoor()
    iFCItem = this.setCommonIFCItemAttributes(row, iFCItem)
    iFCItem = this.setIFCComponentAttributes(row, iFCItem)

    return iFCItem
  }

  buildIFCRoof(row): IFCRoof {
    let iFCItem: IFCRoof = new IFCRoof()
    iFCItem = this.setCommonIFCItemAttributes(row, iFCItem)
    iFCItem = this.setIFCComponentAttributes(row, iFCItem)

    return iFCItem
  }

  buildIFCFlatRoof(row): IFCFlatRoof {
    let iFCItem: IFCFlatRoof = new IFCFlatRoof()
    iFCItem = this.setCommonIFCItemAttributes(row, iFCItem)
    iFCItem = this.setIFCComponentAttributes(row, iFCItem)

    return iFCItem
  }

  buildIFCSpace(row): IFCSpace {
    let iFCItem: IFCSpace = new IFCSpace()
    iFCItem = this.setCommonIFCItemAttributes(row, iFCItem)
    iFCItem.occupancyType = row.OccupancyType
    iFCItem.centerOfGravityZ = parseInt(row.CenterOfGravityZ)

    return iFCItem
  }

  buildIFCSlab(row): IFCSlab {
    let iFCItem: IFCSlab = new IFCSlab()
    iFCItem = this.setCommonIFCItemAttributes(row, iFCItem)
    iFCItem = this.setIFCComponentAttributes(row, iFCItem)
    if (
      !isString(row.PredefinedType) ||
      !ALL_PREDEFINED_TYPES.includes(row.PredefinedType.toUpperCase())
    ) {
      iFCItem.predefinedType = PREDEFINED_TYPE_FLOOR
    } else {
      iFCItem.predefinedType = row.PredefinedType
    }

    return iFCItem
  }

  buildIFCBuilding(row): IFCBuilding {
    let iFCItem: IFCBuilding = new IFCBuilding()
    iFCItem = this.setCommonIFCItemAttributes(row, iFCItem)
    iFCItem.status = row.Status
    iFCItem.name = row.Name

    return iFCItem
  }

  buildIFCZone(row): IFCZone {
    let iFCItem: IFCZone = new IFCZone()
    iFCItem = this.setCommonIFCItemAttributes(row, iFCItem)
    iFCItem.name = row.Name
    iFCItem.status = row.Status
    iFCItem.acousticRatingLevelReq = row.AcousticRatingLevelReq

    return iFCItem
  }
}
