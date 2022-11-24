import { Lookup } from "../interfaces/lookup";

export class AddressModel {
  id: number;
  street: string;
  numExt: string;
  numInt?: string;
  suburb: string;
  postalCode: string;
  state: string;
  countryId: number;
  country: Lookup;

  constructor(address) {
    this.id = address.id;
    this.street = address.street;
    this.numExt = address.numExt;
    this.numInt = address.numInt;
    this.suburb = address.suburb;
    this.postalCode = address.postalCode;
    this.state = address.state;
    this.countryId = address.countryId;
    this.country = address.country;
  }
}
