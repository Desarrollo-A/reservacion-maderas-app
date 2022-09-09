import { RequestRoomModel } from "./request-room.model";
import { Lookup } from "../../../core/interfaces/lookup";
import { UserModel } from "../../user/models/user.model";
import { LabelButton } from "../../../shared/interfaces/label-button";
import { getLabelStatusRequest } from "../../../shared/utils/utils";
import { InventoryModel } from "../../inventory/models/inventory.model";

export class RequestModel {
  id: number;
  code: string;
  startDate: Date | string;
  endDate: Date | string;
  duration: number;
  comment: string;
  cancelComment?: string;
  addGoogleCalendar: boolean;
  people: number;
  userId: number;
  statusId: number;
  status: Lookup;
  user: UserModel;
  requestRoom?: RequestRoomModel;
  inventories?: InventoryModel[];
  isAvailable: boolean;

  constructor(request) {
    this.id = request.id;
    this.code = request.code;
    this.startDate = request.startDate;
    this.endDate = request.endDate;
    this.duration = request.duration;
    this.comment = request.comment;
    this.cancelComment = request.cancelComment;
    this.addGoogleCalendar = request.addGoogleCalendar;
    this.people = request.people;
    this.userId = request.userId;
    this.statusId = request.statusId;
    this.status = request.status;
    this.user = request.user;
    this.requestRoom = request.requestRoom;
    this.inventories = request.inventories;
    this.isAvailable = request.isAvailable;
  }

  get statusName(): string {
    return this.status.name;
  }

  get labelStatus(): LabelButton {
    return getLabelStatusRequest(this.statusName, this.status.code);
  }
}
