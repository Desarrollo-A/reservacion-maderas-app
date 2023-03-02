export interface ProposalPackageRequest {
  requestId: number;
  startDate: string;
  isDriverSelected: boolean;
  packageId: number;
  carId?: number;
  driverId?: number;
  endDate?: string;
}
