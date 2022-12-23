import { DriverScheduleModel } from "./driver-schedule.model";
import { CarScheduleModel } from "./car-schedule.model";

export class DriverRequestScheduleModel {
    requestDriverId:   number;
    driverScheduleId:  number;
    driverSchedule:    DriverScheduleModel;
    carScheduleId:     number;
    carSchedule:       CarScheduleModel;

  constructor(driverRequestSchedule) {
    this.requestDriverId = driverRequestSchedule.requestDriverId;
    this.driverScheduleId = driverRequestSchedule.driverScheduleId;
    this.driverSchedule = new DriverScheduleModel(driverRequestSchedule.driverSchedule);
    this.carScheduleId = driverRequestSchedule.carScheduleId;
    this.carSchedule = new CarScheduleModel(driverRequestSchedule.carSchedule);
  }
}