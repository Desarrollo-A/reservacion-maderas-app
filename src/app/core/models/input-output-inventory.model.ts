export class InputOutputInventoryModel {
  code: string;
  name: string;
  quantity: number;
  cost: number;
  type: string;
  moveDate: Date;

  constructor(inventory) {
    this.code = inventory.code;
    this.name = inventory.name;
    this.quantity = inventory.quantity;
    this.cost = inventory.cost;
    this.type = inventory.type;
    this.moveDate = new Date(inventory.moveDate);
  }
}
