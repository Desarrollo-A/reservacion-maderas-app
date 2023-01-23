export interface ProposalCarDriverRequest {
  requestId: number;
  driverId?: number;
  carId: number;
  startDate: string;
  endDate: string;
}
