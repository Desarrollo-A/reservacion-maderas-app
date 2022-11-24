import { AddressModel } from "./address.model";
import { RequestModel } from "./request.model";

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
  pickupAddress: AddressModel;
  arrivalAddress: AddressModel;
  request: RequestModel;

  constructor(address) {
    this.id = address.id;
    this.authorizationFilename = address.authorizationFilename;
    this.nameReceive = address.nameReceive;
    this.emailReceive = address.emailReceive;
    this.commentReceive = address.commentReceive;
    this.pickupAddressId = address.pickupAddressId;
    this.arrivalAddressId = address.arrivalAddressId;
    this.requestId = address.requestId;
    this.officeId = address.officeId;
    this.trackingCode = address.trackingCode;
    this.pickupAddress = address.pickupAddress;
    this.arrivalAddress = address.arrivalAddress;
    this.request = address.request;
  }
}
