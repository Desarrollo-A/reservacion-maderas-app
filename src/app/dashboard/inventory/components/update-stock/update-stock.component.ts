import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InventoryService } from "../../services/inventory.service";
import { ToastrService } from "ngx-toastr";
import { InventoryModel } from "../../models/inventory.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { greaterThanCero } from "../../../../shared/utils/form-validations";

@UntilDestroy()
@Component({
  selector: 'app-update-stock',
  templateUrl: './update-stock.component.html',
  styleUrls: ['./update-stock.component.scss']
})
export class UpdateStockComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  costVisibility = false;

  constructor(private dialogRef: MatDialogRef<UpdateStockComponent>,
              private fb: FormBuilder,
              private inventoryService: InventoryService,
              private toastrService: ToastrService,
              @Inject(MAT_DIALOG_DATA) public data: InventoryModel) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      stock: [null, [Validators.required, Validators.min(-100), Validators.max(100)]],
      cost: [null]
    });

    this.form.get('stock').valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(stock => {
      if (!stock) {
        if (stock === 0) this.form.get('stock').reset();

        this.costVisibility = false;
        this.form.get('cost')?.reset();
        this.form.get('cost')?.clearValidators();
        this.form.get('cost')?.updateValueAndValidity();
      }

      if (stock > 0) {
        this.costVisibility = true;
        this.form.get('cost')?.addValidators([Validators.required, Validators.max(99999), greaterThanCero]);
        this.form.get('cost')?.updateValueAndValidity();
      }

      if (stock < 0) {
        this.costVisibility = false;
        this.form.get('cost')?.reset();
        this.form.get('cost')?.clearValidators();
        this.form.get('cost')?.updateValueAndValidity();
      }
    });

    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { stock, cost } = this.form.getRawValue();
    this.inventoryService.updateStock(this.data.id, stock, cost).subscribe(() => {
      this.toastrService.success('Stock actualizado', 'Proceso exitoso');
      this.dialogRef.close(true);
    });
  }
}
