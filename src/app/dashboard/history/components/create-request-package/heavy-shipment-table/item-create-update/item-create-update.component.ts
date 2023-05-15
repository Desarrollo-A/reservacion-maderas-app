import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../../../shared/utils/form-error";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HeavyShipmentModel } from "../../../../../../core/models/heavy-shipment.model";
import { uid } from "../../../../../../shared/utils/utils";

@Component({
  selector: 'app-item-create-update',
  templateUrl: './item-create-update.component.html',
  styles: [
  ]
})
export class ItemCreateUpdateComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  constructor(
    private dialogRef: MatDialogRef<ItemCreateUpdateComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data?: HeavyShipmentModel
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      high: [this.data?.high ?? null, [Validators.required, Validators.min(1), Validators.max(999999)]],
      long: [this.data?.long ?? null, [Validators.required, Validators.min(1), Validators.max(999999)]],
      width: [this.data?.width ?? null, [Validators.required, Validators.min(1), Validators.max(999999)]],
      description: [this.data?.description ?? null, [
        Validators.required, Validators.minLength(3), Validators.maxLength(2500)
      ]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let data: HeavyShipmentModel;
    if (!this.data) {
      data = {
        id: uid(),
        ... this.form.getRawValue()
      };
    } else {
      data = {
        id: this.data.id,
        ... this.form.getRawValue()
      };
    }

    this.dialogRef.close(data);
  }
}
