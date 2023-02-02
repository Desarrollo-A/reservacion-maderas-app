import { AddressModel } from "./address.model";
import { RequestModel } from "./request.model";
import { DriverPackageScheduleModel } from "./driver-package-schedule.model";
import { DeliveredPackageModel } from "./delivered-package.model";

export class PackageModel {
  id: number;
  authorizationFilename: string;
  authorizationFile: File;
  nameReceive: string;
  emailReceive: string;
  commentReceive: string;
  pickupAddressId: number;
  arrivalAddressId: number;
  requestId: number;
  officeId: number;
  trackingCode?: string;

  urlTracking?: string;
  isUrgent: boolean;
  pickupAddress: AddressModel;
  arrivalAddress: AddressModel;
  request: RequestModel;
  driverPackageSchedule?: DriverPackageScheduleModel;
  deliveredPackage: DeliveredPackageModel;

  constructor(data) {
    this.id = data.id;
    this.authorizationFilename = data.authorizationFilename;
    this.nameReceive = data.nameReceive;
    this.emailReceive = data.emailReceive;
    this.commentReceive = data.commentReceive;
    this.pickupAddressId = data.pickupAddressId;
    this.arrivalAddressId = data.arrivalAddressId;
    this.requestId = data.requestId;
    this.officeId = data.officeId;
    this.trackingCode = data.trackingCode;
    this.urlTracking = data.urlTracking;
    this.isUrgent = data.isUrgent;
    this.pickupAddress = data.pickupAddress;
    this.arrivalAddress = data.arrivalAddress;
    this.request = new RequestModel(data.request);
    this.driverPackageSchedule = (data.driverPackageSchedule) ?
      new DriverPackageScheduleModel(data.driverPackageSchedule)
      : null;
    this.deliveredPackage = data.deliveredPackage;
  }
}
