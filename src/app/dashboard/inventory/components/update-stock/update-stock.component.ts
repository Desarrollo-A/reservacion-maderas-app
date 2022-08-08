import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InventoryService } from "../../services/inventory.service";
import { ToastrService } from "ngx-toastr";
import { InventoryModel } from "../../models/inventory.model";

@Component({
  selector: 'app-update-stock',
  templateUrl: './update-stock.component.html',
  styleUrls: ['./update-stock.component.scss']
})
export class UpdateStockComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  constructor(private dialogRef: MatDialogRef<UpdateStockComponent>,
              private fb: FormBuilder,
              private inventoryService: InventoryService,
              private toastrService: ToastrService,
              @Inject(MAT_DIALOG_DATA) public data: InventoryModel) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      stock: [null, [Validators.required, Validators.min(-100), Validators.max(100)]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  public save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { stock } = this.form.getRawValue();
    this.inventoryService.updateStock(this.data.id, stock).subscribe(() => {
      this.toastrService.success('Stock actualizado', 'Proceso exitoso');
      this.dialogRef.close(true);
    });
  }
}
