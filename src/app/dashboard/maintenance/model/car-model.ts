import { Lookup } from "src/app/core/interfaces/lookup";
import { Car } from "../interfaces/car";

export class CarModel{
    businessName: string;
    trademark: string;
    model: string;
    color: string;
    licensePlate: string;
    serie: string;
    circulationCard: string;
    status: Lookup;

    constructor(car: Car){
        this.businessName = car.businessName;
        this.trademark = car.trademark;
        this.model = car.model;
        this.color = car.color;
        this.licensePlate = car.licensePlate
        this.serie = car.serie;
        this.circulationCard = car.circulationCard;
        this.status = car.status;
    }

    get statusName(): string {
        return this.status.name;
    }

    get labelStatus(): { text: string, textClass: string, bgClass: string } {
        if (this.statusName === 'Activa') {
          return { text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light' };
        } else if (this.statusName === 'Inactiva') {
          return { text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light' };
        } else {
          return { text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };
        }
      }



}