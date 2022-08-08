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
} from '../libs/lib-acoustic-rating/src/calculator'
import {
  ExternalAcousticRating,
  ExternalAcousticRatingCollection,
} from '../libs/lib-acoustic-rating/src/external-acoustic-rating'
import CsvConverter from '../libs/lib-acoustic-rating/src/csv-converter'
import {
  NOISE_EXPOSURE_HIGH,
  NOISE_EXPOSURE_LOW,
  NOISE_EXPOSURE_MODERATE,
  NOISE_EXPOSURE_VERY_HIGH,
  NoiseExposureMap,
  SPECTRUM_ADJUSTMENT_TYPE_C,
  SPECTRUM_ADJUSTMENT_TYPE_CTR,
  SpectrumAdjustmentTypeMap,
} from '../libs/lib-acoustic-rating/src/noise-exposure'
import {
  NOISE_SENSITIVITY_LOW,
  NOISE_SENSITIVITY_MODERATE,
  NOISE_SENSITIVITY_NONE,
  NoiseSensitivityMap,
} from '../libs/lib-acoustic-rating/src/noise-sensitivity'

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
    const additionalNoiseSensitivityMap: NoiseSensitivityMap = {
      Terrasse: NOISE_SENSITIVITY_NONE,
      Waschraum: NOISE_SENSITIVITY_NONE,
      Einfahrt: NOISE_SENSITIVITY_NONE,
      Keller: NOISE_SENSITIVITY_NONE,
      Technik: NOISE_SENSITIVITY_NONE,
      Tiefgarage: NOISE_SENSITIVITY_NONE,
      Treppenhaus: NOISE_SENSITIVITY_NONE,
      Gewerbe: NOISE_SENSITIVITY_LOW,
      Bad: NOISE_SENSITIVITY_LOW,
      Wohnen: NOISE_SENSITIVITY_MODERATE,
      Schlafen: NOISE_SENSITIVITY_MODERATE,
    }

    const additionalAirborneNoiseExposureMap: NoiseExposureMap = {
      Keller: NOISE_EXPOSURE_LOW,
      Wohnen: NOISE_EXPOSURE_MODERATE,
      Schlafen: NOISE_EXPOSURE_MODERATE,
      Bad: NOISE_EXPOSURE_MODERATE,
      Tiefgarage: NOISE_EXPOSURE_MODERATE,
      Einfahrt: NOISE_EXPOSURE_MODERATE,
      Terrasse: NOISE_EXPOSURE_MODERATE,
      Treppenhaus: NOISE_EXPOSURE_MODERATE,
      Waschraum: NOISE_EXPOSURE_HIGH,
      Technik: NOISE_EXPOSURE_HIGH,
      Gewerbe: NOISE_EXPOSURE_VERY_HIGH,
    }
    const additionalFootstepNoiseExposureMap: NoiseExposureMap = {
      Keller: NOISE_EXPOSURE_LOW,
      Wohnen: NOISE_EXPOSURE_MODERATE,
      Schlafen: NOISE_EXPOSURE_MODERATE,
      Bad: NOISE_EXPOSURE_MODERATE,
      Tiefgarage: NOISE_EXPOSURE_MODERATE,
      Einfahrt: NOISE_EXPOSURE_MODERATE,
      Treppenhaus: NOISE_EXPOSURE_MODERATE,
      Terrasse: NOISE_EXPOSURE_MODERATE,
      Waschraum: NOISE_EXPOSURE_VERY_HIGH,
      Technik: NOISE_EXPOSURE_LOW,
      Gewerbe: NOISE_EXPOSURE_HIGH,
    }
    const additionalSpectrumAdjustmentTypeMap: SpectrumAdjustmentTypeMap = {
      Keller: SPECTRUM_ADJUSTMENT_TYPE_C,
      Wohnen: SPECTRUM_ADJUSTMENT_TYPE_C,
      Schlafen: SPECTRUM_ADJUSTMENT_TYPE_C,
      Bad: SPECTRUM_ADJUSTMENT_TYPE_C,
      Tiefgarage: SPECTRUM_ADJUSTMENT_TYPE_CTR,
      Einfahrt: SPECTRUM_ADJUSTMENT_TYPE_CTR,
      Terrasse: SPECTRUM_ADJUSTMENT_TYPE_C,
      Treppenhaus: SPECTRUM_ADJUSTMENT_TYPE_C,
      Waschraum: SPECTRUM_ADJUSTMENT_TYPE_CTR,
      Technik: SPECTRUM_ADJUSTMENT_TYPE_C,
      Gewerbe: SPECTRUM_ADJUSTMENT_TYPE_CTR,
    }

    const items = new CsvConverter().convertToComponents(file.buffer.toString())
    const calculator = new AcousticRatingCalculator(
      items,
      externalAcousticRatings,
      additionalNoiseSensitivityMap,
      additionalAirborneNoiseExposureMap,
      additionalFootstepNoiseExposureMap,
      additionalSpectrumAdjustmentTypeMap,
    )
    return calculator.calculate()
  }
}
