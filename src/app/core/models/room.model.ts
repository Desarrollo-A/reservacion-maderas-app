import { Lookup } from "../interfaces/lookup";
import { LabelButton } from "../../shared/interfaces/label-button";
import { StatusRoomLookup } from "../enums/lookups/status-room.lookup";
import { OfficeModel } from "./office.model";

export class RoomModel {
  id: number;
  code: string;
  name: string;
  officeId: number;
  noPeople: number;
  recepcionistId: number;
  statusId: number;
  status: Lookup;
  office: OfficeModel;

  constructor(room) {
    this.id = room.id;
    this.code = room.code;
    this.name = room.name;
    this.officeId = room.officeId;
    this.noPeople = room.noPeople;
    this.recepcionistId = room.recepcionistId;
    this.statusId = room.statusId;
    this.status = room.status;
    this.office = room.office;
  }

  get statusName(): string {
    return this.status.value;
  }

  get labelStatus(): LabelButton {
    if (this.status.code === StatusRoomLookup[StatusRoomLookup.ACTIVE]) {
      return { text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.status.code === StatusRoomLookup[StatusRoomLookup.DOWN]) {
      return { text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light' };
    } else if (this.status.code === StatusRoomLookup[StatusRoomLookup.MAINTENANCE]) {
      return { text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };
    }
  }
}
