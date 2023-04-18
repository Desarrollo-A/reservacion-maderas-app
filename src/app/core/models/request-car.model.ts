import { RequestModel } from "./request.model";
import { CarRequestScheduleModel } from "./car-request-schedule.model";
import { OfficeModel } from "./office.model";
import { FileModel } from "./file.model";

export class RequestCarModel {
  id: number;
  requestId: number;
  request: RequestModel;
  officeId: number;
  initialKm?: number;
  finalKm?: number;
  deliveryCondition?: string;
  carRequestSchedule?: CarRequestScheduleModel;
  office: OfficeModel;
  files: FileModel[];

  constructor(requestCar) {
    this.id = requestCar.id;
    this.requestId = requestCar.requestId;
    this.request = new RequestModel(requestCar.request);
    this.officeId = requestCar.officeId;
    this.initialKm = requestCar.initialKm;
    this.finalKm = requestCar.finalKm;
    this.deliveryCondition = requestCar.deliveryCondition;
    this.carRequestSchedule = (requestCar.carRequestSchedule)
      ? new CarRequestScheduleModel(requestCar.carRequestSchedule)
      : null;
    this.office = requestCar.office;
    this.files = requestCar.files;
  }
}
