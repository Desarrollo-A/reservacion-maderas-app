export class DatesModel {
  startDate: Date;
  endDate: Date;

  constructor(data) {
    this.startDate = new Date(data.startDate);
    this.endDate = new Date(data.endDate);
  }
}
