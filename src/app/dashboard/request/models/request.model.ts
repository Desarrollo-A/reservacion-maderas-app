import { RequestRoomModel } from "./request-room.model";
import { Lookup } from "../../../core/interfaces/lookup";
import { UserModel } from "../../user/models/user.model";

export class RequestModel {
  id: number;
  startDate: Date | string;
  endDate: Date | string;
  duration: number;
  comment: string;
  addGoogleCalendar: boolean;
  people: number;
  userId: number;
  statusId: number;
  status: Lookup;
  user: UserModel;
  requestRoom?: RequestRoomModel;
}
