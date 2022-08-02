import { RequestRoomModel } from "./request-room.model";

export class RequestModel {
  startDate: Date | string;
  endDate: Date | string;
  comment: string;
  addGoogleCalendar;
  people: number;
  requestRoom?: RequestRoomModel;
}
