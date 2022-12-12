import { RequestModel } from "./request.model";

export class RequestCarModel {
  id: number;
  authorizationFilename: string;
  responsiveFilename: string;
  requestId: number;
  request: RequestModel;
  officeId: number;

  constructor(requestCar) {
    this.id = requestCar.id;
    this.authorizationFilename = requestCar.authorizationFilename;
    this.responsiveFilename = requestCar.responsiveFilename;
    this.requestId = requestCar.requestId;
    this.request = new RequestModel(requestCar.request);
    this.officeId = requestCar.officeId;
  }
}
