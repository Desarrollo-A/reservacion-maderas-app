import { InventoryModel } from "./inventory.model";

export class InventoryRequestModel {
  requestId: number;
  inventoryId: number;
  inventory: InventoryModel;
  quantity: number;
  applied: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
