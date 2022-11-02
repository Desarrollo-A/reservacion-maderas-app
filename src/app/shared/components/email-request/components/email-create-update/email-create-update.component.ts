import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../utils/form-error";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RequestEmailModel } from "../../../../../core/models/request-email.model";

@Component({
  selector: 'app-email-create-update',
  templateUrl: './email-create-update.component.html',
  styleUrls: ['./email-create-update.component.scss']
})
export class EmailCreateUpdateComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  constructor(@Inject(MAT_DIALOG_DATA) public data: RequestEmailModel,
              private dialogRef: MatDialogRef<EmailCreateUpdateComponent>,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      email: [this.data?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(150)]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let emailRequest: RequestEmailModel = this.form.getRawValue();
    if (this.data) {
      emailRequest.id = this.data.id;
      emailRequest.requestId = this.data.requestId;
    }

    this.dialogRef.close(emailRequest);
  }
}
