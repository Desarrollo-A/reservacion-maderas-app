import { StateModel } from "./state.model";

export class OfficeModel {
  id: number;
  name: string;
  address: string;
  stateId: number;
  state: StateModel;

  constructor(office?) {
    this.id = office?.id;
    this.name = office?.name ?? office.nom_oficina;
    this.address = office?.address;
    this.stateId = office?.stateId;
    this.state = office?.state;
  }
}
