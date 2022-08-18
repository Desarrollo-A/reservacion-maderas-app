import { Lookup } from "src/app/core/interfaces/lookup";
import { OfficeModel } from "../../../core/models/office.model";
import { InventoryRequestModel } from "../../history/models/inventory-request.model";

export class InventoryModel {
  id: number;
  name: string;
  description?: string;
  stock: number;
  trademark?: number;
  image: string;
  minimumStock: number;
  meeting?: number;
  status: boolean;
  typeId: number;
  unitId: number;
  officeId: number;
  type: Lookup;
  unit: Lookup;
  office: OfficeModel;
  inventoryRequest: InventoryRequestModel;

  constructor(inventory) {
    this.id = inventory.id;
    this.name = inventory.name;
    this.description = inventory.description;
    this.stock = inventory.stock;
    this.trademark = inventory.trademark;
    this.image = inventory.image;
    this.minimumStock = inventory.minimumStock;
    this.meeting = inventory.meeting;
    this.status = inventory.status;
    this.typeId = inventory.typeId;
    this.unitId = inventory.unitId;
    this.officeId = inventory.officeId;
    this.type = inventory.type;
    this.unit = inventory.unit;
    this.office = inventory.office;
    this.inventoryRequest = inventory.inventoryRequest;
  }

  get typeInventoryName(): string {
      return this.type.name;
  }

  get unitName(): string {
      return this.unit.name;
  }
}
