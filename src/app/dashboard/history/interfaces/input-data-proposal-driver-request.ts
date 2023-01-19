import { RequestDriverModel } from "../../../core/models/request-driver.model";

export interface InputDataProposalDriverRequest {
  dates: Date[];
  requestDriver: RequestDriverModel;
}
