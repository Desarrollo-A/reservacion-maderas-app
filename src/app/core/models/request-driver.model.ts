import { AddressModel } from "./address.model";
import { RequestModel } from "./request.model";

export class RequestDriverModel {
  id: number;
  pickupAddressId: number;
  arrivalAddressId: number;
  authorizationFilename: string;
  officeId: number;
  requestId: number;
  pickupAddress: AddressModel;
  arrivalAddress: AddressModel;
  request: RequestModel;

  constructor(requestDriver) {
    this.id = requestDriver.id;
    this.pickupAddressId = requestDriver.pickupAddressId;
    this.arrivalAddressId = requestDriver.arrivalAddressId;
    this.authorizationFilename = requestDriver.authorizationFilename;
    this.officeId = requestDriver.officeId;
    this.requestId = requestDriver.requestId;
    this.pickupAddress = requestDriver.pickupAddress;
    this.arrivalAddress = requestDriver.arrivalAddress;
    this.request = new RequestModel(requestDriver.request);
  }
}
