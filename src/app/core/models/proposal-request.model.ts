export class ProposalRequestModel {
  id: number;
  requestId: number;
  startDate: Date | string;
  endDate?: Date | string;

  constructor(proposalRequest) {
    this.id = proposalRequest.id;
    this.requestId = proposalRequest.requestId;
    this.startDate = new Date(proposalRequest.startDate);
    this.endDate = (proposalRequest.endDate) ? new Date(proposalRequest.endDate) : null;
  }
}
