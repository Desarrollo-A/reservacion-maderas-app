import { StateModel } from "./state.model";
import { LabelButton } from "../../shared/interfaces/label-button";
import { AddressModel } from "./address.model";

export class OfficeModel {
  id: number;
  name: string;
  addressId: number;
  address: AddressModel;
  stateId: number;
  state: StateModel;
  status: boolean;

  constructor(office?) {
    this.id = office?.id;
    this.name = office?.name ?? office.nom_oficina;
    this.addressId = office?.addressId;
    this.address = office?.address;
    this.stateId = office?.stateId;
    this.state = office?.state;
    this.status = office.status;
  }

  get statusLabel(): LabelButton {
    return (this.status)
      ? { text: 'Activo', textClass: 'text-green', bgClass: 'bg-green-light' }
      : { text: 'Inactivo', textClass: 'text-red', bgClass: 'bg-red-light' };
  }
}
