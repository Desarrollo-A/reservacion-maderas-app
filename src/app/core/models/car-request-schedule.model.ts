import { CarScheduleModel } from "./car-schedule.model";

export class CarRequestScheduleModel {
  requestCarId: number;
  carScheduleId: number;
  carSchedule: CarScheduleModel;

  constructor(carRequestSchedule) {
    this.requestCarId = carRequestSchedule.requestCarId;
    this.carScheduleId = carRequestSchedule.carScheduleId;
    this.carSchedule = new CarScheduleModel(carRequestSchedule.carSchedule);
  }
}
