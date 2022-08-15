import { RequestModel } from "./request.model";
import { RoomModel } from "../../maintenance/model/room.model";
import { Lookup } from "../../../core/interfaces/lookup";

export class RequestRoomModel {
  requestId: number;
  roomId: number;
  externalPeople: number;
  levelId: number;
  request?: RequestModel;
  room: RoomModel;
  level: Lookup;
}
