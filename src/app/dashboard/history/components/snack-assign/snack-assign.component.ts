import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InventoryModel } from "../../../../core/models/inventory.model";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { FormErrors } from "../../../../shared/utils/form-error";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { InventoryRequestModel } from "../../../../core/models/inventory-request.model";
import { trackById } from "../../../../shared/utils/track-by";

interface Data {
  snacks: InventoryModel[];
  row?: InventoryModel;
}

@UntilDestroy()
@Component({
  selector: 'app-snack-assign',
  templateUrl: './snack-assign.component.html',
  styleUrls: ['./snack-assign.component.scss']
})
export class SnackAssignComponent {
  form: FormGroup;
  formErrors: FormErrors;
  filteredSnacks: Observable<InventoryModel[]>;
  snackSelected: InventoryModel;
  disableInput = false;
  enableQuantity = false;
  trackById = trackById;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data,
              private dialogRef: MatDialogRef<SnackAssignComponent>,
              private fb: FormBuilder) {
    this.snackSelected = data.row;

    this.form = this.fb.group({
      snackCtrl: [this.data.row?.name, [Validators.required]],
      quantity: [null]
    });

    if (this.snackSelected) {
      this.addOrRemoveValidatorsQuantity();
      this.disableInput = true;
    }

    this.formErrors = new FormErrors(this.form);

    this.filteredSnacks = this.form.get('snackCtrl')?.valueChanges.pipe(
      untilDestroyed(this),
      startWith(''),
      map(snack => (snack ? this._filterSnacks(snack) : this.data.snacks.slice()))
    );
  }

  remove(): void {
    if (this.snackSelected) {
      this.snackSelected = null;
      this.disableInput = false;
      this.enableQuantity = false;
      this.form.get('snackCtrl').setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.snackSelected = event.option.value;
    this.form.get('snackCtrl').setValue(this.snackSelected.name);
    this.disableInput = true;

    this.addOrRemoveValidatorsQuantity();
  }

  save(): void {
    if (!this.snackSelected) {
      this.form.get('snackCtrl')?.setValue(null);
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { quantity } = this.form.getRawValue();

    this.snackSelected.inventoryRequest = <InventoryRequestModel>{
      quantity,
      inventoryId: this.snackSelected.id,
      requestId: this.data.row?.inventoryRequest?.requestId
    };

    this.dialogRef.close(this.snackSelected);
  }

  private addOrRemoveValidatorsQuantity(): void {
    const inventory = this.snackSelected;
    if (inventory.meeting) {
      this.form.get('quantity')?.clearValidators();
      this.form.get('quantity')?.updateValueAndValidity();
      this.form.get('quantity')?.setValue(null);
    } else {
      this.enableQuantity = true;

      const maxQuantity = inventory.stock + (this.data.row?.inventoryRequest?.quantity ?? 0);
      this.form.get('quantity')?.addValidators([Validators.required, Validators.min(1),
        Validators.max(maxQuantity)]);
      this.form.get('quantity')?.updateValueAndValidity();
      this.form.get('quantity')?.setValue(this.data.row?.inventoryRequest?.quantity ?? 1);
    }
  }

  private _filterSnacks(value: string|InventoryModel): InventoryModel[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.data.snacks.filter(snack => snack.name.toLowerCase().includes(filterValue));
    } else {
      const filterValue = value.name.toLowerCase()
      return this.data.snacks.filter(snack => snack.name.toLowerCase().includes(filterValue));
    }
  }
}
