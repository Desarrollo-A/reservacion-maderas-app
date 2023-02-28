import { RequestModel } from "./request.model";
import { CarRequestScheduleModel } from "./car-request-schedule.model";
import { OfficeModel } from "./office.model";

export class RequestCarModel {
  id: number;
  authorizationFilename?: string;
  responsiveFilename?: string;
  imageZip?: string;
  requestId: number;
  request: RequestModel;
  officeId: number;
  initialKm?: number;
  finalKm?: number;
  deliveryCondition?: string;
  carRequestSchedule?: CarRequestScheduleModel;
  office: OfficeModel;

  constructor(requestCar) {
    this.id = requestCar.id;
    this.authorizationFilename = requestCar.authorizationFilename;
    this.responsiveFilename = requestCar.responsiveFilename;
    this.imageZip = requestCar.imageZip;
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
  }
}
