import { Lookup } from "../../../core/interfaces/lookup";
import { Room } from "../interfaces/room";

export class RoomModel {
  id: number;
  code: string;
  name: string;
  officeId: number;
  noPeople: number;
  recepcionistId: number;
  statusId: number;
  status: Lookup;

  constructor(room: Room) {
    this.id = room.id;
    this.code = room.code;
    this.name = room.name;
    this.officeId = room.officeId;
    this.noPeople = room.noPeople;
    this.recepcionistId = room.recepcionistId;
    this.statusId = room.statusId;
    this.status = room.status;
  }

  get statusName(): string {
    return this.status.name;
  }

  get labelStatus(): { text: string, textClass: string, bgClass: string } {
    if (this.statusName === 'Activa') {
      return { text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.statusName === 'Inactiva') {
      return { text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light' };
    } else {
      return { text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };
    }
  }
}
