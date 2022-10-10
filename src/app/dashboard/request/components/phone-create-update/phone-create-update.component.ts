import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RequestPhoneNumberModel } from "../../../../core/models/request-phone-number.model";

@Component({
  selector: 'app-phone-create-update',
  templateUrl: './phone-create-update.component.html',
  styleUrls: ['./phone-create-update.component.scss']
})
export class PhoneCreateUpdateComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  constructor(@Inject(MAT_DIALOG_DATA) public data: RequestPhoneNumberModel,
              private dialogRef: MatDialogRef<PhoneCreateUpdateComponent>,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      phone: [this.data?.phone ?? '', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let phoneRequest: RequestPhoneNumberModel = this.form.getRawValue();
    if (this.data) {
      phoneRequest.id = this.data.id;
    }

    this.dialogRef.close(phoneRequest);
  }
}
