import { Lookup } from "src/app/core/interfaces/lookup";
import { OfficeModel } from "src/app/core/models/office.model";
import { StatusCarLookup } from "../enums/lookups/status-car.lookup";
import { DriverModel } from "./driver.model";
import { DatesModel } from "./dates.model";

export class CarModel {
  id:number;
  businessName: string;
  trademark: string;
  model: string;
  color: string;
  licensePlate: string;
  serie: string;
  circulationCard: string;
  people: number;
  officeId: number;
  office: OfficeModel;
  statusId: number;
  status: Lookup;
  drivers: DriverModel[];
  availableSchedules?: DatesModel[];

  constructor(car) {
    this.id = car.id;
    this.businessName = car.businessName;
    this.trademark = car.trademark;
    this.model = car.model;
    this.color = car.color;
    this.licensePlate = car.licensePlate
    this.serie = car.serie;
    this.circulationCard = car.circulationCard;
    this.people = car.people;
    this.officeId = car.officeId;
    this.office = car.office;
    this.statusId = car.statusId;
    this.status = car.status;
    this.drivers = car.drivers;
    this.availableSchedules = (car.availableSchedules)
      ? car.availableSchedules.map(schedule => new DatesModel(schedule))
      : null;
  }

  get statusName(): string {
    return this.status.value;
  }

  get labelStatus(): { text: string, textClass: string, bgClass: string } {
    if (this.status.code === StatusCarLookup[StatusCarLookup.ACTIVE]) {
      return { text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.status.code === StatusCarLookup[StatusCarLookup.DOWN]) {
      return { text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light' };
    } else if (this.status.code === StatusCarLookup[StatusCarLookup.MAINTENANCE]){
      return { text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };
    }
  }

  get smallInformation(): string {
    return `${this.trademark} ${this.model} Color ${this.color}, Placa ${this.licensePlate}`;
  }

  get hasDrivers(): boolean {
    return this.drivers.length > 0;
  }
}
