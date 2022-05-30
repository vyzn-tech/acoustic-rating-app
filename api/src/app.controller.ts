import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from './api-file.decorator';
import { ApiTags } from '@nestjs/swagger';
import { parse } from 'csv-parse';
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
} from '../libs/acoustic-rating-calculator/src';

const csvMimeTypes = [
  'application/csv',
  'application/x-csv',
  'text/csv',
  'text/comma-separated-values',
  'text/x-comma-separated-values',
];

const csvHeaders = [
  'GUID',
  'Entity',
  'PredefinedType',
  'ParentIds',
  'Name',
  'AcousticRatingLevelReq',
  'Status',
  'IsExternal',
  'OccupancyType',
  'CelestialDirection',
  'CenterOfGravityZ',
];

const multerOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (csvMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${file.originalname}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};

@Controller()
@ApiTags('dbs-acoustic-rating')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiFile()
  @Post('calculate')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  calculate(@UploadedFile() file: Express.Multer.File) {
    parse(
      file.buffer.toString(),
      {
        delimiter: ',',
        columns: csvHeaders,
        fromLine: 2,
      },
      (error, rows) => {
        const ifcItems = this.buildIFCItems(rows);
        console.log(ifcItems);
      },
    );
  }

  buildIFCItems(rows): IFCItem[] {
    const ifcItems: IFCItem[] = [];
    for (const row of rows) {
      switch (row.Entity.toLowerCase()) {
        case 'ifcbuilding':
          ifcItems.push(this.buildIFCBuilding(row));
          break;
        case 'ifcdoor':
          ifcItems.push(this.buildIFCDoor(row));
          break;
        case 'ifcroof':
          ifcItems.push(this.buildIFCRoof(row));
          break;
        case 'ifcspace':
          ifcItems.push(this.buildIFCSpace(row));
          break;
        case 'ifcslab':
          ifcItems.push(this.buildIFCSlab(row));
          break;
        case 'ifcwall':
          ifcItems.push(this.buildIFCWall(row));
          break;
        case 'ifczone':
          ifcItems.push(this.buildIFCZone(row));
          break;
      }
    }

    return ifcItems;
  }

  buildCommonIFCItemAttributes<T extends IFCItem>(row, iFCItem): T {
    let parentIds = [];
    parentIds = row.ParentIds.replace(/ /g, '').split(',');
    iFCItem.id = row.GUID;
    iFCItem.parentIds = parentIds;

    return iFCItem;
  }

  buildIFCComponentAttributes<T extends IFCItem>(row, iFCItem): T {
    iFCItem.isExternal = row.IsExternal.toLowerCase() === 'true';
    iFCItem.celestialDirection = row.CelestialDirection;

    return iFCItem;
  }

  buildIFCWall(row): IFCWall {
    let iFCItem: IFCWall = new IFCWall();
    iFCItem = this.buildCommonIFCItemAttributes(row, iFCItem);
    iFCItem = this.buildIFCComponentAttributes(row, iFCItem);

    return iFCItem;
  }

  buildIFCDoor(row): IFCDoor {
    let iFCItem: IFCDoor = new IFCDoor();
    iFCItem = this.buildCommonIFCItemAttributes(row, iFCItem);
    iFCItem = this.buildIFCComponentAttributes(row, iFCItem);

    return iFCItem;
  }

  buildIFCRoof(row): IFCRoof {
    let iFCItem: IFCRoof = new IFCRoof();
    iFCItem = this.buildCommonIFCItemAttributes(row, iFCItem);
    iFCItem = this.buildIFCComponentAttributes(row, iFCItem);

    return iFCItem;
  }

  buildIFCSpace(row): IFCSpace {
    let iFCItem: IFCSpace = new IFCSpace();
    iFCItem = this.buildCommonIFCItemAttributes(row, iFCItem);
    iFCItem.occupancyType = row.OccupancyType;
    iFCItem.centerOfGravityZ = parseInt(row.CenterOfGravityZ);

    return iFCItem;
  }

  buildIFCSlab(row): IFCSlab {
    let iFCItem: IFCSlab = new IFCSlab();
    iFCItem = this.buildCommonIFCItemAttributes(row, iFCItem);
    iFCItem = this.buildIFCComponentAttributes(row, iFCItem);
    if (
      !row.PredefinedType instanceof String ||
      !ALL_PREDEFINED_TYPES.includes(row.PredefinedType.toUpperCase())
    ) {
      iFCItem.predefinedType = PREDEFINED_TYPE_FLOOR;
    } else {
      iFCItem.predefinedType = row.PredefinedType;
    }

    return iFCItem;
  }

  buildIFCBuilding(row): IFCBuilding {
    let iFCItem: IFCBuilding = new IFCBuilding();
    iFCItem = this.buildCommonIFCItemAttributes(row, iFCItem);
    iFCItem.name = row.Name;
    iFCItem.status = row.Status;

    return iFCItem;
  }

  buildIFCZone(row): IFCZone {
    let iFCItem: IFCZone = new IFCZone();
    iFCItem = this.buildCommonIFCItemAttributes(row, iFCItem);
    iFCItem.name = row.Name;
    iFCItem.status = row.Status;
    iFCItem.acousticRatingLevelReq = row.AcousticRatingLevelReq;

    return iFCItem;
  }
}
