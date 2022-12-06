import { DriverScheduleModel } from "./driver-schedule.model";
import { CarScheduleModel } from "./car-schedule.model";

export class DriverPackageScheduleModel {
  packageId: number;
  driverScheduleId: number;
  driverSchedule: DriverScheduleModel;
  carScheduleId: number;
  carSchedule: CarScheduleModel;

  constructor(driverPackageSchedule) {
    this.packageId = driverPackageSchedule.packageId;
    this.driverScheduleId = driverPackageSchedule.driverScheduleId;
    this.driverSchedule = new DriverScheduleModel(driverPackageSchedule.driverSchedule);
    this.carScheduleId = driverPackageSchedule.carScheduleId;
    this.carSchedule = new CarScheduleModel(driverPackageSchedule.carSchedule);
  }
}
