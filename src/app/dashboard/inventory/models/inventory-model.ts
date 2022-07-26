import { Lookup } from "src/app/core/interfaces/lookup";

export class InventoryModel {
  name: string;
  description: string;
  cantidadStock: number;
  status: Lookup;
  typeInventory: Lookup;
  unit: Lookup;

  constructor(inventory){
    this.name = inventory.name;
    this.description = inventory.description;
    this.cantidadStock = inventory.cantidadStock;
    this.status = inventory.status;
    this.typeInventory = inventory.typeInventory;
    this.unit = inventory.unit;
  }

  get statusName(): string {
      return this.status.name;
  }

  get typeInventoryName(): string {
      return this.typeInventory.name;
  }

  get unitName(): string {
      return this.unit.name;
  }

  get labelStatus(): { text: string, textClass: string, bgClass: string } {
    if (this.statusName === 'Activo') {
      return { text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.statusName === 'Inactivo') {
      return { text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light' };
    } else {
      return { text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };
    }
  }

  get labelTypeInventory(): { text: string, textClass: string, bgClass: string } {
    return { text: this.typeInventoryName, textClass: '', bgClass: '' };
  }

  get labelUnit(): { text: string, textClass: string, bgClass: string } {
    return { text: this.unitName, textClass: '', bgClass: '' };
  }

}
