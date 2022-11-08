import { ActionRequestNotificationModel } from "./action-request-notification.model";
import { RequestModel } from "../../../../../core/models/request.model";

export class RequestNotificationModel {
  id: number;
  notificationId: number;
  requestId: number;
  request: RequestModel;
  actionRequestNotification?: ActionRequestNotificationModel;
}
