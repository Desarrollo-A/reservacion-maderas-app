import { Component, Input, OnInit } from '@angular/core';
import { Lookup } from "../../../../core/interfaces/lookup";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { StatusRequestRoomLookup } from "../../../../core/enums/lookups/status-request-room.lookup";
import { CancelRequestModel } from "../../../../core/models/cancel-request.model";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";

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
    if (this.previousStatus.code === StatusRequestRoomLookup[StatusRequestRoomLookup.APPROVED]) {
      return 'Cancelar solicitud';
    } else if (this.previousStatus.code === StatusRequestRoomLookup[StatusRequestRoomLookup.CANCELLED]) {
      return `Solicitud cancelada por ${this.cancelRequest.user.fullName}`;
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      cancelComment: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
    });
    this.formErrors = new FormErrors(this.form);
  }
}
