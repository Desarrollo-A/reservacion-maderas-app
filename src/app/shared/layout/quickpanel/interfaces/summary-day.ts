import { RequestModel } from "../../../../dashboard/request/models/request.model";

export interface SummaryDay {
  title: string;
  subtitle: string;
  request: RequestModel;
}
