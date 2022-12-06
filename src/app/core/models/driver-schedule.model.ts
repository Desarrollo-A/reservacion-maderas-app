import { DriverModel } from "./driver.model";

export class DriverScheduleModel {
  id: number;
  driverId: number;
  driver: DriverModel;
  startDate: Date;
  endDate: Date;

  constructor(driverSchedule) {
    this.id = driverSchedule.id;
    this.driverId = driverSchedule.driverId;
    this.driver = new DriverModel(driverSchedule.driver);
    this.startDate = new Date(driverSchedule.startDate);
    this.endDate = new Date(driverSchedule.endDate);
  }
}
