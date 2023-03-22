import { Component, Input, OnInit } from '@angular/core';
import { Lookup } from "../../../../core/interfaces/lookup";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { StatusRequestRoomLookup } from "../../../../core/enums/lookups/status-request-room.lookup";
import { CancelRequestModel } from "../../../../core/models/cancel-request.model";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { StatusPackageRequestLookup } from "../../../../core/enums/lookups/status-package-request.lookup";
import { StatusDriverRequestLookup } from "../../../../core/enums/lookups/status-driver-request.lookup";
import { StatusCarRequestLookup } from "../../../../core/enums/lookups/status-car-request.lookup";
import { TypeLookup } from "../../../../core/enums/type-lookup";

@Component({
  selector: 'app-cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['./cancel-request.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class CancelRequestComponent implements OnInit {
  @Input()
  previousStatus: Lookup;
  @Input()
  cancelRequest: CancelRequestModel;

  form: FormGroup;
  formErrors: FormErrors;

  constructor(private fb: FormBuilder) {}

  get statusRequest(): typeof StatusRequestRoomLookup {
    return StatusRequestRoomLookup;
  }

  get title(): string {
    const code = this.previousStatus.code;
    const type = this.previousStatus.type;

    if (
      (type === TypeLookup.STATUS_ROOM_REQUEST && code === StatusRequestRoomLookup[StatusRequestRoomLookup.CANCELLED]) ||
      (type === TypeLookup.STATUS_PACKAGE_REQUEST && code === StatusPackageRequestLookup[StatusPackageRequestLookup.CANCELLED]) ||
      (type === TypeLookup.STATUS_DRIVER_REQUEST && code === StatusDriverRequestLookup[StatusDriverRequestLookup.CANCELLED]) ||
      (type === TypeLookup.STATUS_CAR_REQUEST && code === StatusCarRequestLookup[StatusCarRequestLookup.CANCELLED])
    ) {
      return `Solicitud cancelada por ${this.cancelRequest.user.fullName}`;
    }

    return 'Cancelar solicitud';
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      cancelComment: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
    });
    this.formErrors = new FormErrors(this.form);
  }
}
