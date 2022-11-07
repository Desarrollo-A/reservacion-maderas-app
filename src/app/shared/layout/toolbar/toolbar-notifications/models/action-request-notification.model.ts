import { Lookup } from "../../../../../core/interfaces/lookup";

export class ActionRequestNotificationModel {
  requestNotificationId: number;
  isAnswered: boolean;
  typeId: number;
  type: Lookup;
}
