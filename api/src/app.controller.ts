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
import {
  SPECTRUM_ADJUSTMENT_TYPE_C,
  SPECTRUM_ADJUSTMENT_TYPE_CTR,
} from '../libs/acoustic-rating-calculator/src/noise-exposure'

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
@ApiTags('acoustic-rating-app')
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
          n: {
            day: 62,
            night: 55,
            spectrumAdjustmentType: SPECTRUM_ADJUSTMENT_TYPE_CTR,
          },
          ne: {
            day: 62,
            night: 55,
            spectrumAdjustmentType: SPECTRUM_ADJUSTMENT_TYPE_CTR,
          },
          e: {
            day: 0,
            night: 0,
            spectrumAdjustmentType: SPECTRUM_ADJUSTMENT_TYPE_C,
          },
          se: {
            day: 0,
            night: 0,
            spectrumAdjustmentType: SPECTRUM_ADJUSTMENT_TYPE_C,
          },
          s: {
            day: 0,
            night: 0,
            spectrumAdjustmentType: SPECTRUM_ADJUSTMENT_TYPE_C,
          },
          sw: {
            day: 0,
            night: 0,
            spectrumAdjustmentType: SPECTRUM_ADJUSTMENT_TYPE_C,
          },
          w: {
            day: 0,
            night: 0,
            spectrumAdjustmentType: SPECTRUM_ADJUSTMENT_TYPE_C,
          },
          nw: {
            day: 0,
            night: 0,
            spectrumAdjustmentType: SPECTRUM_ADJUSTMENT_TYPE_C,
          },
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
        new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_CTR),
        new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_CTR),
        new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
        new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
        new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
        new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
        new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
        new ExternalAcousticRating(0, 0, SPECTRUM_ADJUSTMENT_TYPE_C),
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
