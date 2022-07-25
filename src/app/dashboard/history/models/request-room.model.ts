export class RequestRoomModel {
  id: number;
  startDate: Date;
  endDate: Date;
  user: string;
  room: string;
  status: string;

  constructor(requestRoom) {
    this.id = requestRoom.id;
    this.startDate = requestRoom.startDate;
    this.endDate = requestRoom.endDate;
    this.user = requestRoom.user;
    this.room = requestRoom.room;
    this.status = requestRoom.status;
  }

  get labelStatus(): { text: string, textClass: string, bgClass: string } {
    if (this.status === 'Disponible') {
      return { text: this.status, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.status === 'Ocupada') {
      return { text: this.status, textClass: 'text-orange', bgClass: 'bg-orange-light' };
    }
  }
}
