import { LabelButton } from "../../shared/interfaces/label-button";
import { getStatusLabelRequestPackage } from "../../shared/utils/utils";

export class RequestPackageViewModel {
  requestId: number;
  packageId: number;
  code: string;
  title: string;
  startDate: Date;
  endDate: Date;
  statusName: string;
  statusCode: string;
  officeId: number;
  fullName: string;
  statePickup: string;
  stateArrival: string;
  userId: number;

  constructor(requestPackage) {
    this.requestId = requestPackage.requestId;
    this.packageId = requestPackage.packageId;
    this.code = requestPackage.code;
    this.title = requestPackage.title;
    this.startDate = new Date(requestPackage.startDate);
    this.endDate = new Date(requestPackage.endDate);
    this.statusName = requestPackage.statusName;
    this.statusCode = requestPackage.statusCode;
    this.officeId = requestPackage.officeId;
    this.fullName = requestPackage.fullName;
    this.statePickup = requestPackage.statePickup;
    this.stateArrival = requestPackage.stateArrival;
    this.userId = requestPackage.userId;
  }

  get statusLabel(): LabelButton {
    return getStatusLabelRequestPackage(this.statusName, this.statusCode);
  }
}
