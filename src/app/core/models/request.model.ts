import { RequestRoomModel } from "./request-room.model";
import { Lookup } from "../interfaces/lookup";
import { UserModel } from "./user.model";
import { LabelButton } from "../../shared/interfaces/label-button";
import { getLabelStatusRequest } from "../../shared/utils/utils";
import { InventoryModel } from "./inventory.model";
import { CancelRequestModel } from "./cancel-request.model";
import { ProposalRequestModel } from "./proposal-request.model";
import { RequestPhoneNumberModel } from "./request-phone-number.model";
import { RequestEmailModel } from "./request-email.model";
import { ScoreModel } from "./score.model";
import { PackageModel } from "./package.model";

export class RequestModel {
  id: number;
  code: string;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  typeId: number;
  comment: string;
  addGoogleCalendar: boolean;
  people: number;
  userId: number;
  statusId: number;
  status: Lookup;
  type: Lookup;
  user: UserModel;
  requestRoom?: RequestRoomModel;
  inventories?: InventoryModel[];
  isAvailable: boolean;
  cancelRequest: CancelRequestModel;
  proposalRequest: ProposalRequestModel[];
  requestPhoneNumber: RequestPhoneNumberModel[];
  requestEmail: RequestEmailModel[];
  score?: ScoreModel;
  package?: PackageModel;

  constructor(request) {
    this.id = request.id;
    this.code = request.code;
    this.title = request.title;
    this.startDate = request.startDate;
    this.endDate = request.endDate;
    this.typeId = request.typeId;
    this.comment = request.comment;
    this.addGoogleCalendar = request.addGoogleCalendar;
    this.people = request.people;
    this.userId = request.userId;
    this.statusId = request.statusId;
    this.status = request.status;
    this.type = request.type;
    this.user = request.user;
    this.requestRoom = request.requestRoom;
    this.inventories = request.inventories;
    this.isAvailable = request.isAvailable;
    this.cancelRequest = request.cancelRequest;
    this.proposalRequest = request.proposalRequest.map(data => new ProposalRequestModel(data));
    this.requestPhoneNumber = request.requestPhoneNumber;
    this.requestEmail = request.requestEmail;
    this.score = request.score;
    this.package = request.package;
  }

  get statusName(): string {
    return this.status.name;
  }

  get labelStatus(): LabelButton {
    return getLabelStatusRequest(this.statusName, this.status.code);
  }
}
