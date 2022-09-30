import { Lookup } from "../../../../../core/interfaces/lookup";
import { TypeNotificationLookup } from "../enums/type-notification.lookup";

export class NotificationModel {
  id: number;
  message: string;
  isRead: boolean;
  userId: number;
  requestId: number;
  typeId: number;
  createdAt: string;
  type: Lookup;
  color: Lookup;

  constructor(notification) {
    this.id = notification.id;
    this.message = notification.message;
    this.isRead = notification.isRead;
    this.userId = notification.userId;
    this.requestId = notification.requestId;
    this.typeId = notification.typeId;
    this.createdAt = notification.createdAt;
    this.type = notification.type;
    this.color = notification.color;
  }

  get typeName(): string {
    return this.type.name;
  }

  get colorHex(): string {
    return this.color.name;
  }

  get icon(): string {
    if (this.type.code === TypeNotificationLookup[TypeNotificationLookup.ROOM]) {
      return 'mat:meeting_room';
    } else if (this.type.code === TypeNotificationLookup[TypeNotificationLookup.CAR]) {
      return 'mat:directions_car';
    } else if (this.type.code === TypeNotificationLookup[TypeNotificationLookup.DRIVER]) {
      return 'mat:face';
    } else if (this.type.code === TypeNotificationLookup[TypeNotificationLookup.INVENTORY]) {
      return 'mat:inventory_2';
    } else if (this.type.code === TypeNotificationLookup[TypeNotificationLookup.GENERAL]) {
      return 'mat:notifications';
    }
  }
}
