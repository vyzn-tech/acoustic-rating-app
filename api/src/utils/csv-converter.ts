import {
  ALL_PREDEFINED_TYPES,
  Building,
  Door,
  FlatRoof,
  Component,
  NeighbourBuilding,
  PREDEFINED_TYPE_FLOOR,
  PREDEFINED_TYPE_ROOF,
  PredefinedType,
  Roof,
  Slab,
  Space,
  Wall,
  Zone,
} from '../../libs/acoustic-rating-calculator/src/calculator'
import { isString } from 'lodash'
import { parseCSV } from 'csv-load-sync'

const CSV_KEY_ID = 'GUID'
const CSV_KEY_PARENT_IDS = 'ParentIds'
const CSV_KEY_IS_EXTERNAL = 'IsExternal'
const CSV_KEY_CELESTIAL_DIRECTION = 'CelestialDirection'
const CSV_KEY_OCCUPANCY_TYPE = 'OccupancyType'
const CSV_KEY_CENTER_OF_GRAVITY_Z = 'CenterOfGravityZ'
const CSV_KEY_PREDEFINED_TYPE = 'PredefinedType'
const CSV_KEY_NAME = 'Name'
const CSV_KEY_STATUS = 'Status'
const CSV_KEY_ENTITY = 'Entity'
const CSV_KEY_ACOUSTIC_RATING_LEVEL = 'AcousticRatingLevelReq'

class CsvConverter {
  public convertToComponents(csvString: string): Component[] {
    const rows = parseCSV(csvString)
    return this.buildComponents(rows)
  }
  private buildComponents(rows): Component[] {
    const items: Component[] = []
    for (const row of rows) {
      switch (row[CSV_KEY_ENTITY].toLowerCase()) {
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

      if (row[CSV_KEY_ENTITY].toLowerCase() === 'ifcbuilding') {
        if (row[CSV_KEY_OCCUPANCY_TYPE]) {
          items.push(this.buildNeighbourBuilding(row))
          continue
        }
        items.push(this.buildBuilding(row))
      }

      if (row[CSV_KEY_ENTITY].toLowerCase() === 'ifcslab') {
        if (row[CSV_KEY_PREDEFINED_TYPE] === PREDEFINED_TYPE_ROOF) {
          items.push(this.buildFlatRoof(row))
          continue
        }
        items.push(this.buildSlab(row))
      }
    }
    return items
  }

  private getParentIds(row): string[] {
    let parentIds = []
    parentIds = row[CSV_KEY_PARENT_IDS].replace(/ /g, '').split(',')
    return parentIds
  }

  private isExternal(row): boolean {
    return row[CSV_KEY_IS_EXTERNAL].toLowerCase() === 'true'
  }

  private buildWall(row): Wall {
    return new Wall(
      row[CSV_KEY_ID],
      this.getParentIds(row),
      this.isExternal(row),
      row[CSV_KEY_CELESTIAL_DIRECTION],
    )
  }

  private buildDoor(row): Door {
    return new Door(
      row[CSV_KEY_ID],
      this.getParentIds(row),
      this.isExternal(row),
      row[CSV_KEY_CELESTIAL_DIRECTION],
    )
  }

  private buildRoof(row): Roof {
    return new Roof(
      row[CSV_KEY_ID],
      this.getParentIds(row),
      this.isExternal(row),
      row[CSV_KEY_CELESTIAL_DIRECTION],
    )
  }

  private buildFlatRoof(row): FlatRoof {
    return new FlatRoof(
      row[CSV_KEY_ID],
      this.getParentIds(row),
      this.isExternal(row),
      row[CSV_KEY_CELESTIAL_DIRECTION],
    )
  }

  private buildSpace(row): Space {
    return new Space(
      row[CSV_KEY_ID],
      this.getParentIds(row),
      row[CSV_KEY_OCCUPANCY_TYPE],
      parseInt(row[CSV_KEY_CENTER_OF_GRAVITY_Z]),
    )
  }

  private buildSlab(row): Slab {
    let predefinedType: PredefinedType = null
    if (
      !isString(row[CSV_KEY_PREDEFINED_TYPE]) ||
      !ALL_PREDEFINED_TYPES.includes(row[CSV_KEY_PREDEFINED_TYPE].toUpperCase())
    ) {
      predefinedType = PREDEFINED_TYPE_FLOOR
    } else {
      predefinedType = row[CSV_KEY_PREDEFINED_TYPE]
    }

    return new Slab(
      row[CSV_KEY_ID],
      this.getParentIds(row),
      this.isExternal(row),
      row[CSV_KEY_CELESTIAL_DIRECTION],
      predefinedType,
    )
  }

  private buildBuilding(row): Building {
    return new Building(
      row[CSV_KEY_ID],
      this.getParentIds(row),
      row[CSV_KEY_NAME],
      row[CSV_KEY_STATUS],
    )
  }

  private buildNeighbourBuilding(row): NeighbourBuilding {
    return new NeighbourBuilding(
      row[CSV_KEY_ID],
      this.getParentIds(row),
      row[CSV_KEY_OCCUPANCY_TYPE],
    )
  }

  private buildZone(row): Zone {
    return new Zone(
      row[CSV_KEY_ID],
      this.getParentIds(row),
      row[CSV_KEY_NAME],
      row[CSV_KEY_STATUS],
      row[CSV_KEY_ACOUSTIC_RATING_LEVEL],
    )
  }
}

export default CsvConverter
