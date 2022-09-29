export class ProposalRequestModel {
  requestId: number;
  startDate: Date | string;
  endDate: Date | string;

  constructor(proposalRequest) {
    this.requestId = proposalRequest.requestId;
    this.startDate = new Date(proposalRequest.startDate);
    this.endDate = new Date(proposalRequest.endDate);
  }
}
