import { LabelButton } from "../../../shared/interfaces/label-button";
import { StatusRequestLookup } from "../enums/status-request.lookup";

export class RequestRoomViewModel {
  id: number;
  startDate: Date;
  endDate: Date;
  fullName: string;
  officeId: number;
  userId: number;
  statusName: string;
  roomName: string;
  levelMeeting: string;

  constructor(requestRoom) {
    this.id = requestRoom.id;
    this.startDate = requestRoom.startDate;
    this.endDate = requestRoom.endDate;
    this.fullName = requestRoom.fullName;
    this.officeId = requestRoom.officeId;
    this.userId = requestRoom.userId;
    this.statusName = requestRoom.statusName;
    this.roomName = requestRoom.roomName;
    this.levelMeeting = requestRoom.levelMeeting;
  }

  get labelStatus(): LabelButton {
    if (this.statusName === StatusRequestLookup.NEW) {
      return { text: this.statusName, textClass: 'text-primary', bgClass: 'bg-primary/10' };
    } else if (this.statusName === StatusRequestLookup.APPROVED) {
      return { text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.statusName === StatusRequestLookup.REJECTED || this.statusName === StatusRequestLookup.CANCELLED) {
      return { text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light' };
    } else if (this.statusName === StatusRequestLookup.PROPOSAL) {
      return { text: this.statusName, textClass: 'text-orange', bgClass: 'bg-orange-light' };
    } else if (this.statusName === StatusRequestLookup.WITHOUT_ATTENDING) {
      return { text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };
    } else if (this.statusName === StatusRequestLookup.FINISHED) {
      return { text: this.statusName, textClass: 'text-teal', bgClass: 'bg-teal-light' };
    }
  }
}
