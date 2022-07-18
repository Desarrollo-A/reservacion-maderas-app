import { Lookup } from "../../../core/interfaces/lookup";

export interface Room {
  id: number;
  code: string;
  name: string;
  officeId: number;
  noPeople: number;
  recepcionistId: number;
  statusId: number;
  status: Lookup;
}
