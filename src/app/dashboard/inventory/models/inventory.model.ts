import { Lookup } from "src/app/core/interfaces/lookup";
import { OfficeModel } from "../../../core/models/office.model";

export class InventoryModel {
  id: number;
  name: string;
  description?: string;
  stock: number;
  minimumStock: number;
  meeting?: number;
  status: boolean;
  typeId: number;
  unitId: number;
  officeId: number;
  type: Lookup;
  unit: Lookup;
  office: OfficeModel;

  constructor(inventory) {
    this.id = inventory.id;
    this.name = inventory.name;
    this.description = inventory.description;
    this.stock = inventory.stock;
    this.minimumStock = inventory.minimumStock;
    this.meeting = inventory.meeting;
    this.status = inventory.status;
    this.typeId = inventory.typeId;
    this.unitId = inventory.unitId;
    this.officeId = inventory.officeId;
    this.type = inventory.type;
    this.unit = inventory.unit;
    this.office = inventory.office;
  }

  get typeInventoryName(): string {
      return this.type.name;
  }

  get unitName(): string {
      return this.unit.name;
  }
}
