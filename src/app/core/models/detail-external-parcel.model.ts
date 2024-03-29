export class DetailExternalParcelModel {
  packageId: number;
  companyName: string;
  trackingCode: string;
  urlTracking: string;
  weight: number;

  constructor(data) {
    this.packageId = data.packageId;
    this.companyName = data.companyName;
    this.trackingCode = data.trackingCode;
    this.urlTracking = data.urlTracking;
    this.weight = data.weight;
  }
}
