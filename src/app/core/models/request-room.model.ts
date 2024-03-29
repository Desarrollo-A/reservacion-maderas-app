import { RequestModel } from "./request.model";
import { RoomModel } from "./room.model";
import { Lookup } from "../interfaces/lookup";

export class RequestRoomModel {
  requestId: number;
  roomId: number;
  externalPeople: number;
  levelId: number;
  duration: number;
  requestsApproved?: number;
  request?: RequestModel;
  room: RoomModel;
  level: Lookup;

  constructor(requestRoom) {
    this.requestId = requestRoom.requestId;
    this.roomId = requestRoom.roomId;
    this.externalPeople = requestRoom.externalPeople;
    this.levelId = requestRoom.levelId;
    this.duration = requestRoom.duration;
    this.requestsApproved = requestRoom.requestsApproved;
    this.request = (requestRoom.request) ? new RequestModel(requestRoom.request) : undefined;
    this.room = requestRoom.room;
    this.level = requestRoom.level;
  }
}
