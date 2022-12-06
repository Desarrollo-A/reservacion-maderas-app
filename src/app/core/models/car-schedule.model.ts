import { CarModel } from "./car.model";

export class CarScheduleModel {
  id: number;
  carId: number;
  car: CarModel;
  startDate: Date;
  endDate: Date;

  constructor(carSchedule) {
    this.id = carSchedule.id;
    this.carId = carSchedule.carId;
    this.car = new CarModel(carSchedule.car);
    this.startDate = new Date(carSchedule.startDate);
    this.endDate = new Date(carSchedule.endDate);
  }
}
