export class RequestEmailModel {
  id: number;
  requestId: number;
  name: string;
  email: string;

  constructor(requestEmail) {
    this.id = requestEmail.id;
    this.requestId = requestEmail.requestId;
    this.name = requestEmail.name;
    this.email = requestEmail.email;
  }
}
