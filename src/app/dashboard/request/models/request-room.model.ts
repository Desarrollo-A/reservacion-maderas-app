import { RequestModel } from "./request.model";
import { RoomModel } from "../../maintenance/model/room.model";
import { Lookup } from "../../../core/interfaces/lookup";

export class RequestRoomModel {
  requestId: number;
  roomId: number;
  externalPeople: number;
  levelId: number;
  duration: number;
  request?: RequestModel;
  room: RoomModel;
  level: Lookup;

  constructor(requestRoom) {
    this.requestId = requestRoom.requestId;
    this.roomId = requestRoom.roomId;
    this.externalPeople = requestRoom.externalPeople;
    this.levelId = requestRoom.levelId;
    this.duration = requestRoom.duration;
    this.request = (requestRoom.request) ? new RequestModel(requestRoom.request) : undefined;
    this.room = requestRoom.room;
    this.level = requestRoom.level;
  }
}
