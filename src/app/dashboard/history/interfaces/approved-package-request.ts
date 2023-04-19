export interface ApprovedPackageRequest {
  driverId: number;
  carId: number;
  companyName: string;
  trackingCode: string;
  urlTracking: string;
  requestId: number;
  packageId: number;
  endDate: Date;
  weight: number;
}
