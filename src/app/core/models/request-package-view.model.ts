import { LabelButton } from "../../shared/interfaces/label-button";
import { StatusPackageRequestLookup } from "../enums/lookups/status-package-request.lookup";
import { StatusRequestLookup } from "../enums/lookups/status-request.lookup";

export class RequestPackageViewModel {
  id: number;
  code: string;
  title: string;
  startDate: Date;
  statusName: string;
  statusCode: string;
  officeId: number;
  fullName: string;
  statePickup: string;
  stateArrival: string;
  userId: number;

  constructor(requestPackage) {
    this.id = requestPackage.id;
    this.code = requestPackage.code;
    this.title = requestPackage.title;
    this.startDate = new Date(requestPackage.startDate);
    this.statusName = requestPackage.statusName;
    this.statusCode = requestPackage.statusCode;
    this.officeId = requestPackage.officeId;
    this.fullName = requestPackage.fullName;
    this.statePickup = requestPackage.statePickup;
    this.stateArrival = requestPackage.stateArrival;
    this.userId = requestPackage.userId;
  }

  get statusLabel(): LabelButton {
    if (this.statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.NEW]) {
      return { text: this.statusName, textClass: 'text-blue', bgClass: 'bg-blue-light' };
    }
    if (this.statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.APPROVED]) {
      return { text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light' };
    }
    if (this.statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.REJECTED] ||
      this.statusCode === StatusRequestLookup[StatusRequestLookup.CANCELLED]) {
      return { text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light' };
    }
    if (this.statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.PROPOSAL]) {
      return { text: this.statusName, textClass: 'text-orange', bgClass: 'bg-orange-light' };
    }
    if (this.statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.EXPIRED]) {
      return { text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };
    }
    if (this.statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.FINISHED]) {
      return { text: this.statusName, textClass: 'text-teal', bgClass: 'bg-teal-light' };
    }
    if (this.statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.ROAD]) {
      return { text: this.statusName, textClass: 'text-purple', bgClass: 'bg-purple-light' };
    }
  }
}
