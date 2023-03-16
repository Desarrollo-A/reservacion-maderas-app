export class PerDiemModel {
  requestId: number;
  gasoline: number;
  tollbooths: number;
  food: number;
  billFilename?: string;
  spent?: number;

  constructor(data) {
    this.requestId = data.requestId;
    this.gasoline = data.gasoline;
    this.tollbooths = data.tollbooths;
    this.food = data.food;
    this.billFilename = data.billFilename;
    this.spent = data.spent;
  }
}
