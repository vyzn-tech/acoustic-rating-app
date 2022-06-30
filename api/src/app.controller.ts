import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { AppService } from './app.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiFile } from './api-file.decorator'
import { ApiQuery, ApiResponseProperty, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import {
  AcousticRatingCalculator,
  OutputItem,
} from '../libs/acoustic-rating-calculator/src/calculator'
import {
  ExternalAcousticRating,
  ExternalAcousticRatingCollection,
} from '../libs/acoustic-rating-calculator/src/external-acoustic-rating'
import CsvConverter from '../libs/acoustic-rating-calculator/src/csv-converter'

const csvMimeTypes = [
  'application/csv',
  'application/x-csv',
  'text/csv',
  'text/comma-separated-values',
  'text/x-comma-separated-values',
  'application/vnd.ms-excel',
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
  @ApiQuery({
    name: 'params',
    schema: {
      type: 'object',
      example: {
        'external-acoustic-ratings': {
          n: { day: 62, night: 55 },
          ne: { day: 62, night: 55 },
          e: { day: 0, night: 0 },
          se: { day: 0, night: 0 },
          s: { day: 0, night: 0 },
          sw: { day: 0, night: 0 },
          w: { day: 0, night: 0 },
          nw: { day: 0, night: 0 },
        },
      },
    },
  })
  @ApiResponseProperty({ type: [OutputItem] })
  calculate(
    @UploadedFile() file: Express.Multer.File,
    @Response({ passthrough: true }) res,
    @Req() request: Request,
  ): OutputItem[] {
    const externalAcousticRatings = Object.assign(
      new ExternalAcousticRatingCollection(
        new ExternalAcousticRating(0, 0),
        new ExternalAcousticRating(0, 0),
        new ExternalAcousticRating(0, 0),
        new ExternalAcousticRating(0, 0),
        new ExternalAcousticRating(0, 0),
        new ExternalAcousticRating(0, 0),
        new ExternalAcousticRating(0, 0),
        new ExternalAcousticRating(0, 0),
      ),
      request.query['external-acoustic-ratings'],
    )

    const items = new CsvConverter().convertToComponents(file.buffer.toString())
    const calculator = new AcousticRatingCalculator(
      items,
      externalAcousticRatings,
    )
    return calculator.calculate()
  }
}
