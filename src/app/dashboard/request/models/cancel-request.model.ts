import { UserModel } from "../../user/models/user.model";

export class CancelRequestModel {
  requestId: number;
  cancelComment: string;
  userId: number;
  user: UserModel;
}
