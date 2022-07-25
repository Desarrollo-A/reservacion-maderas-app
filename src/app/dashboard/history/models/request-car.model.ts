export class RequestCarModel {
  id: number;
  startDate: Date;
  endDate: Date;
  user: string;
  car: string;
  status: string;

  constructor(requestRoom) {
    this.id = requestRoom.id;
    this.startDate = requestRoom.startDate;
    this.endDate = requestRoom.endDate;
    this.user = requestRoom.user;
    this.car = requestRoom.car;
    this.status = requestRoom.status;
  }

  get labelStatus(): { text: string, textClass: string, bgClass: string } {
    if (this.status === 'Disponible') {
      return { text: this.status, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.status === 'Ocupado') {
      return { text: this.status, textClass: 'text-orange', bgClass: 'bg-orange-light' };
    }
  }
}
