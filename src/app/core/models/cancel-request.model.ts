import { UserModel } from "./user.model";

export class CancelRequestModel {
  requestId: number;
  cancelComment: string;
  userId: number;
  user: UserModel;
}
