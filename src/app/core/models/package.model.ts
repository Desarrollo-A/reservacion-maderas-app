import { AddressModel } from "./address.model";
import { RequestModel } from "./request.model";
import { DriverPackageScheduleModel } from "./driver-package-schedule.model";
import { DeliveredPackageModel } from "./delivered-package.model";
import { ProposalPackageModel } from "./proposal-package.model";
import { HeavyShipmentModel } from "./heavy-shipment.model";

export class PackageModel {
  id: number;
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
  proposalPackage?: ProposalPackageModel;
  isHeavyShipping: boolean;
  heavyShipments: HeavyShipmentModel[];

  constructor(data) {
    this.id = data.id;
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
    this.proposalPackage = data.proposalPackage;
    this.isHeavyShipping = data.isHeavyShipping;
    this.heavyShipments = data.heavyShipments;
  }
}
