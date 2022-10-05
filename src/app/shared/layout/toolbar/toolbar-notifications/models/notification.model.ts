import { Lookup } from "../../../../../core/interfaces/lookup";

export class NotificationModel {
  id: number;
  message: string;
  isRead: boolean;
  userId: number;
  requestId: number;
  typeId: number;
  iconId: number;
  createdAt: string;
  type: Lookup;
  color: Lookup;
  icon: Lookup;

  constructor(notification) {
    this.id = notification.id;
    this.message = notification.message;
    this.isRead = notification.isRead;
    this.userId = notification.userId;
    this.requestId = notification.requestId;
    this.typeId = notification.typeId;
    this.iconId = notification.iconId;
    this.createdAt = notification.createdAt;
    this.type = notification.type;
    this.color = notification.color;
    this.icon = notification.icon;
  }

  get typeName(): string {
    return this.type.name;
  }

  get colorHex(): string {
    return this.color.name;
  }

  get matIcon(): string {
    return this.icon.name;
  }
}
