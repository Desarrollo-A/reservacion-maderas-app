import { Lookup } from "../interfaces/lookup";

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

    constructor(driver) {
        this.id = driver.id;
        this.noEmployee = driver.noEmployee;
        this.fullName = driver.noEmployee;
        this.email = driver.email;
        this.personalPhone = driver.personalPhone;
        this.officePhone = driver.officePhone;
        this.officeId = driver.officeId;
        this.statusId = driver.statusId;
        this.status = driver.status;
    }
}