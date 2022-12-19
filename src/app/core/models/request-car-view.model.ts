import { LabelButton } from "src/app/shared/interfaces/label-button";
import { getStatusLabelRequestCar } from "src/app/shared/utils/utils";

export class RequestCarViewModel {
    requestId: number;
    code: number;
    title: string;
    startDate: Date;
    endDate: Date;
    statusName: string;
    statusCode: string;
    officeId: number;
    fullName: string;
    userId: number;
    requestCarId: string;
  
    constructor(requestCarView) {
        this.requestId      =   requestCarView.requestId;
        this.code           =   requestCarView.code;
        this.title          =   requestCarView.title;
        this.startDate      =   new Date(requestCarView.startDate);
        this.endDate        =   new Date(requestCarView.endDate);
        this.statusName     =   requestCarView.statusName;
        this.statusCode     =   requestCarView.statusCode;
        this.officeId       =   requestCarView.officeId;
        this.fullName       =   requestCarView.fullName;
        this.userId         =   requestCarView.userId;
        this.requestCarId   =   requestCarView.requestCarId;
    }

    get statusLabel(): LabelButton{
        return getStatusLabelRequestCar(this.statusName, this.statusCode);
    }
  }