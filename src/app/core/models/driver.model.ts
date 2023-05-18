import { LabelButton } from "src/app/shared/interfaces/label-button";
import { Lookup } from "../interfaces/lookup";
import { CarModel } from "./car.model";
import { StatusUserLookup } from "../enums/lookups/status-user.lookup";
import { DriverParcelDayModel } from "./driver-parcel-day.model";

export class DriverModel {
  id:             number;
  noEmployee:     string;
  fullName:       string;
  email:          string;
  personalPhone:  string;
  officePhone:    string;
  officeId:       number;
  statusId:       number;
  area:           string;
  status:         Lookup;
  cars:           CarModel[];
  availableCars?: CarModel[];
  driverParcelDays: DriverParcelDayModel[];

  constructor(driver) {
    this.id = driver.id;
    this.noEmployee = driver.noEmployee;
    this.fullName = driver.fullName;
    this.email = driver.email;
    this.personalPhone = driver.personalPhone;
    this.officePhone = driver.officePhone;
    this.officeId = driver.officeId;
    this.statusId = driver.statusId;
    this.area = driver.area;
    this.status = driver.status;
    this.cars = driver.cars;
    this.availableCars = (driver.availableCars) ? driver.availableCars.map(car => new CarModel(car)) : null;
    this.driverParcelDays = driver.driverParcelDays;
  }

  get statusName(): string{
    return this.status.value;
  }

  get statusLabel(): LabelButton {
    if(this.status.code === StatusUserLookup[StatusUserLookup.ACTIVE]){
        return {text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light'};
    }else if(this.status.code === StatusUserLookup[StatusUserLookup.INACTIVE]){
        return {text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light'};
    }else if(this.status.code === StatusUserLookup[StatusUserLookup.BLOCKED]){
        return {text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light'};
    }
  }

  get carInfo(): LabelButton {
    if(this.cars.length === 0) {
      return {text: 'Sin asignación', textClass: 'text-gray', bgClass: 'bg-gray-light'};
    }
    const carAssigned: string = this.cars[0].businessName + ', ' + this.cars[0].model;
    return {text: carAssigned, textClass: 'text-blue', bgClass: 'bg-blue-light'};
  }
}
