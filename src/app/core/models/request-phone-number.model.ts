export class RequestPhoneNumberModel {
  id: number;
  requestId: number;
  name: string;
  phone: string;

  constructor(requestPhone) {
    this.id = requestPhone.id;
    this.requestId = requestPhone.requestId;
    this.name = requestPhone.name;
    this.phone = requestPhone.phone;
  }
}
