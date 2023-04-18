import { FileModel } from "./file.model";

export class PerDiemModel {
  id: number;
  requestId: number;
  gasoline: number;
  tollbooths: number;
  food: number;
  spent?: number;
  files: FileModel[];

  constructor(data) {
    this.id = data.id;
    this.requestId = data.requestId;
    this.gasoline = data.gasoline;
    this.tollbooths = data.tollbooths;
    this.food = data.food;
    this.spent = data.spent;
    this.files = data.files;
  }
}
