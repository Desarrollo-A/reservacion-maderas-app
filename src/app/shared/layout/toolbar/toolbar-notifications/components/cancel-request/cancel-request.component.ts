import { Component, Inject, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../../animations/fade-in-up.animation";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../../utils/form-error";
import { CancelRequestModel } from "../../../../../../core/models/cancel-request.model";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RequestModel } from "../../../../../../core/models/request.model";

@Component({
  selector: 'app-cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['./cancel-request.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class CancelRequestComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<CancelRequestComponent>,
              @Inject(MAT_DIALOG_DATA) public request: RequestModel) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cancelComment: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
    });
    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cancelRequest: CancelRequestModel = this.form.getRawValue();
    this.dialogRef.close(cancelRequest);
  }
}
