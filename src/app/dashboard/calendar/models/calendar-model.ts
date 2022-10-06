import { RequestModel } from "../../request/models/request.model";

export class CalendarModel {
  title: string;
  request: RequestModel;


  constructor(calendar) {
    this.title = calendar.title;
    this.request = calendar.request;
  }
}
