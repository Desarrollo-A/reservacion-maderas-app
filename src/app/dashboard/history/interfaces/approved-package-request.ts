export interface ApprovedPackageRequest {
  driverId: number;
  carId: number;
  trackingCode: string;
  urlTracking: string;
  requestId: number;
  packageId: number;
  endDate: Date;
}
