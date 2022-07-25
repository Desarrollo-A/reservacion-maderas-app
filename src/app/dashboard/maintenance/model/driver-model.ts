import { Lookup } from "src/app/core/interfaces/lookup";
import { Driver } from "../interfaces/driver";


export class DriverModel{
fullName: string;
date: Date;
nameApplicant: string;
availability: Lookup;


constructor(driver: Driver){
this.fullName = driver.fullName;
this.date = driver.date;
this.availability = driver.availability;
this.nameApplicant = driver.nameApplicant;
}

get Availability(): string{
    return this.availability.name;
}

get labelAvailability(): { text: string, textClass: string, bgClass: string } {
    if (this.Availability === 'Disponible') {
      return { text: this.Availability, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.Availability === 'Reservado') {
      return { text: this.Availability, textClass: 'text-orange', bgClass: 'bg-orange-light' };
    } else {
      return { text: this.Availability, textClass: 'text-gray', bgClass: 'bg-gray-light' };
    }
  }



}