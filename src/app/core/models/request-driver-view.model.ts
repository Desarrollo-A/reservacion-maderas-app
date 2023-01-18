import { LabelButton } from "../../shared/interfaces/label-button";
import { getStatusLabelRequestDriver } from "../../shared/utils/utils";

export class RequestDriverViewModel {
  requestId: number;
  requestDriverId: number;
  code: string;
  title: string;
  startDate: Date;
  endDate: Date;
  statusName: string;
  statusCode: string;
  fullName: string;
  statePickup: string;
  stateArrival: string;
  driverId?: number;

  constructor(requestDriver) {
    this.requestId = requestDriver.requestId;
    this.requestDriverId = requestDriver.requestDriverId;
    this.code = requestDriver.code;
    this.title = requestDriver.title;
    this.startDate = new Date(requestDriver.startDate);
    this.endDate = new Date(requestDriver.endDate);
    this.statusName = requestDriver.statusName;
    this.statusCode = requestDriver.statusCode;
    this.fullName = requestDriver.fullName;
    this.statePickup = requestDriver.statePickup;
    this.stateArrival = requestDriver.stateArrival;
    this.driverId = requestDriver.driverId;
  }

  get statusLabel(): LabelButton {
    return getStatusLabelRequestDriver(this.statusName, this.statusCode);
  }
}
