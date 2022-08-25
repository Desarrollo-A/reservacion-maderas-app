export class AvailableScheduleModel {
  startTime: string;
  endTime: string;
  startDate: Date | string;
  endDate: Date | string;

  constructor(availableSchedule) {
    this.startTime = availableSchedule.startTime;
    this.endTime = availableSchedule.endTime;
    this.startDate = new Date(availableSchedule.startDate);
    this.endDate = new Date(availableSchedule.endDate);
  }
}
