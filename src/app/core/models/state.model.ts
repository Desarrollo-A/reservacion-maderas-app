export class StateModel {
  id: number;
  name: string;
  status: boolean;

  constructor(state?) {
    this.id = state?.id;
    this.name = state?.name ?? state?.sede;
    this.status = state?.status;
  }
}
