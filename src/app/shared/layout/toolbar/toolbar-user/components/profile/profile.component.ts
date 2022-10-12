import { Component, Inject } from '@angular/core';
import { UserModel } from "../../../../../../core/models/user.model";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public user: UserModel) {}
}
