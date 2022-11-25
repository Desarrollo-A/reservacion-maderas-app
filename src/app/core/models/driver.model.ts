import { LabelButton } from "src/app/shared/interfaces/label-button";
import { StatusDriverLookup } from "../enums/lookups/status-driver.lookup";
import { Lookup } from "../interfaces/lookup";
import { CarModel } from "./car.model";

export class DriverModel {

    id:             number;
    noEmployee:     string;
    fullName:       string;
    email:          string;
    personalPhone:  string;
    officePhone:    string;
    officeId:       number;
    statusId:       number;
    status:         Lookup;
    cars:           CarModel[];

    constructor(driver) {
        this.id = driver.id;
        this.noEmployee = driver.noEmployee;
        this.fullName = driver.fullName;
        this.email = driver.email;
        this.personalPhone = driver.personalPhone;
        this.officePhone = driver.officePhone;
        this.officeId = driver.officeId;
        this.statusId = driver.statusId;
        this.status = driver.status;
        this.cars = driver.cars;
    }

    get statusName(): string{
        return this.status.name;
    }

    get statusLabel(): LabelButton{
        if(this.status.code === StatusDriverLookup[StatusDriverLookup.ACTIVE]){
            return {text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light'};
        }else if(this.status.code === StatusDriverLookup[StatusDriverLookup.INACTIVE]){
            return {text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light'};
        }else if(this.status.code === StatusDriverLookup[StatusDriverLookup.DOWN]){
            return {text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light'};
        }
    }
}