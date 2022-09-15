import { LabelButton } from "../../../shared/interfaces/label-button";
import { getLabelStatusRequest } from "../../../shared/utils/utils";

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
    this.startDate = requestRoom.startDate;
    this.endDate = requestRoom.endDate;
    this.fullName = requestRoom.fullName;
    this.officeId = requestRoom.officeId;
    this.userId = requestRoom.userId;
    this.statusName = requestRoom.statusName;
    this.statusCode = requestRoom.statusCode;
    this.roomName = requestRoom.roomName;
    this.levelMeeting = requestRoom.levelMeeting;
  }

  get labelStatus(): LabelButton {
    return getLabelStatusRequest(this.statusName, this.statusCode);
  }
}
