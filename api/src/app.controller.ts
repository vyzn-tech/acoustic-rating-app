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
  Building,
  Door,
  Item,
  Roof,
  Slab,
  Space,
  Wall,
  Zone,
  PREDEFINED_TYPE_FLOOR,
  AcousticRatingCalculator,
  ExternalAcousticRatingCollection,
  ExternalAcousticRating,
  PREDEFINED_TYPE_ROOF,
  FlatRoof,
  NeighbourBuilding,
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
    const items = this.buildItems(records)
    const calculator = new AcousticRatingCalculator(
      items,
      externalAcousticRatings,
    )
    calculator.calculate()

    const outputCsvAsString = stringify(items)
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

  buildItems(rows): Item[] {
    const items: Item[] = []
    for (const row of rows) {
      switch (row.Entity.toLowerCase()) {
        case 'ifcdoor':
          items.push(this.buildDoor(row))
          continue
        case 'ifcroof':
          items.push(this.buildRoof(row))
          continue
        case 'ifcspace':
          items.push(this.buildSpace(row))
          continue
        case 'ifcwall':
          items.push(this.buildWall(row))
          continue
        case 'ifczone':
          items.push(this.buildZone(row))
          continue
      }

      if (row.Entity.toLowerCase() === 'ifcbuilding') {
        if (row.OccupancyType) {
          items.push(this.buildNeighbourBuilding(row))
          continue
        }
        items.push(this.buildBuilding(row))
      }

      if (row.Entity.toLowerCase() === 'ifcslab') {
        if (row.PredefindedType === PREDEFINED_TYPE_ROOF) {
          items.push(this.buildFlatRoof(row))
          continue
        }
        items.push(this.buildSlab(row))
      }
    }
    return items
  }

  setCommonItemAttributes<T extends Item>(row, item): T {
    let parentIds = []
    parentIds = row.ParentIds.replace(/ /g, '').split(',')
    item.id = row.GUID
    item.parentIds = parentIds

    return item
  }

  setComponentAttributes<T extends Item>(row, item): T {
    item.isExternal = row.IsExternal.toLowerCase() === 'true'
    item.celestialDirection = row.CelestialDirection

    return item
  }

  buildWall(row): Wall {
    let item: Wall = new Wall()
    item = this.setCommonItemAttributes(row, item)
    item = this.setComponentAttributes(row, item)

    return item
  }

  buildDoor(row): Door {
    let item: Door = new Door()
    item = this.setCommonItemAttributes(row, item)
    item = this.setComponentAttributes(row, item)

    return item
  }

  buildRoof(row): Roof {
    let item: Roof = new Roof()
    item = this.setCommonItemAttributes(row, item)
    item = this.setComponentAttributes(row, item)

    return item
  }

  buildFlatRoof(row): FlatRoof {
    let item: FlatRoof = new FlatRoof()
    item = this.setCommonItemAttributes(row, item)
    item = this.setComponentAttributes(row, item)

    return item
  }

  buildSpace(row): Space {
    let item: Space = new Space()
    item = this.setCommonItemAttributes(row, item)
    item.occupancyType = row.OccupancyType
    item.centerOfGravityZ = parseInt(row.CenterOfGravityZ)

    return item
  }

  buildSlab(row): Slab {
    let item: Slab = new Slab()
    item = this.setCommonItemAttributes(row, item)
    item = this.setComponentAttributes(row, item)
    if (
      !isString(row.PredefinedType) ||
      !ALL_PREDEFINED_TYPES.includes(row.PredefinedType.toUpperCase())
    ) {
      item.predefinedType = PREDEFINED_TYPE_FLOOR
    } else {
      item.predefinedType = row.PredefinedType
    }

    return item
  }

  buildBuilding(row): Building {
    let item: Building = new Building()
    item = this.setCommonItemAttributes(row, item)
    item.name = row.Name
    item.status = row.Status

    return item
  }

  buildNeighbourBuilding(row): NeighbourBuilding {
    let item: NeighbourBuilding = new NeighbourBuilding()
    item = this.setCommonItemAttributes(row, item)
    item.occupancyType = row.OccupancyType

    return item
  }

  buildZone(row): Zone {
    let item: Zone = new Zone()
    item = this.setCommonItemAttributes(row, item)
    item.name = row.Name
    item.status = row.Status
    item.acousticRatingLevel = row.AcousticRatingLevelReq

    return item
  }
}
