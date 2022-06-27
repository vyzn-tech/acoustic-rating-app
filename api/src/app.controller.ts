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

import {
  AcousticRatingCalculator,
  ExternalAcousticRatingCollection,
  ExternalAcousticRating,
} from '../libs/acoustic-rating-calculator/src/calculator'
import { createReadStream } from 'fs'
import * as fs from 'fs'
import CsvConverter from './utils/csv-converter'

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
  calculate(
    @UploadedFile() file: Express.Multer.File,
    @Response({ passthrough: true }) res,
  ): StreamableFile {
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
    const items = new CsvConverter().convertToComponents(file.buffer.toString())
    const calculator = new AcousticRatingCalculator(
      items,
      externalAcousticRatings,
    )
    const output = calculator.calculate()

    const outputCsvAsString = stringify(output, { header: true })
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
}
