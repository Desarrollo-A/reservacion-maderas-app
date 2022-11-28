import { LabelButton } from "../../shared/interfaces/label-button";
import { getStatusLabelRequestRoom } from "../../shared/utils/utils";

export class RequestRoomViewModel {
  id: number;
  code: string;
  title: string;
  startDate: Date;
  endDate: Date;
  fullName: string;
  officeId: number;
  userId: number;
  statusName: string;
  statusCode: string;
  roomName: string;
  levelMeeting: string;

  constructor(requestRoom) {
    this.id = requestRoom.id;
    this.code = requestRoom.code;
    this.title = requestRoom.title;
    this.startDate = new Date(requestRoom.startDate);
    this.endDate = requestRoom.endDate;
    this.fullName = requestRoom.fullName;
    this.officeId = requestRoom.officeId;
    this.userId = requestRoom.userId;
    this.statusName = requestRoom.statusName;
    this.statusCode = requestRoom.statusCode;
    this.roomName = requestRoom.roomName;
    this.levelMeeting = requestRoom.levelMeeting;
  }

  get statusLabel(): LabelButton {
    return getStatusLabelRequestRoom(this.statusName, this.statusCode);
  }
}
