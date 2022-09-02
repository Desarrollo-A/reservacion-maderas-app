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

  constructor(notification) {
    this.id = notification.id;
    this.message = notification.message;
    this.isRead = notification.isRead;
    this.userId = notification.userId;
    this.requestId = notification.requestId;
    this.typeId = notification.typeId;
    this.createdAt = notification.createdAt;
    this.type = notification.type;
  }

  get typeName(): string {
    return this.type.name;
  }

  get colorClass(): string {
    if (this.typeName === TypeNotificationLookup.ROOM) {
      return 'text-blue';
    } else if (this.typeName === TypeNotificationLookup.CAR) {
      return 'text-teal';
    } else if (this.typeName === TypeNotificationLookup.DRIVER) {
      return 'text-orange';
    } else if (this.typeName === TypeNotificationLookup.INVENTORY) {
      return 'text-purple';
    } else if (this.typeName === TypeNotificationLookup.GENERAL) {
      return 'text-gray';
    }
  }

  get icon(): string {
    if (this.typeName === TypeNotificationLookup.ROOM) {
      return 'mat:meeting_room';
    } else if (this.typeName === TypeNotificationLookup.CAR) {
      return 'mat:directions_car';
    } else if (this.typeName === TypeNotificationLookup.DRIVER) {
      return 'mat:face';
    } else if (this.typeName === TypeNotificationLookup.INVENTORY) {
      return 'mat:inventory_2';
    } else if (this.typeName === TypeNotificationLookup.GENERAL) {
      return 'mat:notifications';
    }
  }
}
