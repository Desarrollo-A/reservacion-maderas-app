import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RequestModel } from "../../../../core/models/request.model";
import { Router } from "@angular/router";
import { TypeRequestLookup } from "../../../../core/enums/lookups/type-request.lookup";
import { UserSessionService } from "../../../../core/services/user-session.service";
import { NameRole } from "../../../../core/enums/name-role";

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.scss']
})
export class CalendarDetailComponent {

  constructor(private dialogRef: MatDialogRef<CalendarDetailComponent>,
              private router: Router,
              private userSessionService: UserSessionService,
              @Inject(MAT_DIALOG_DATA) public request: RequestModel) {}

  redirectRequestDetail(): void {
    const part = (this.userSessionService.user.role.name === NameRole.RECEPCIONIST) ? 'solicitudes' : 'historial';

    if (this.request.type.code === TypeRequestLookup[TypeRequestLookup.ROOM]) {
      this.dialogRef.close();
      this.router.navigateByUrl(`/dashboard/${part}/sala/${this.request.id}`);
    }
  }
}