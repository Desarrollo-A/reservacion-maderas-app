import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InventoryModel } from "../../../inventory/models/inventory.model";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { FormErrors } from "../../../../shared/utils/form-error";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

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
  snackSelected: InventoryModel[] = [];
  disableInput = false;
  enableQuantity = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data,
              private dialogRef: MatDialogRef<SnackAssignComponent>,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      snackCtrl: ['', [Validators.required]],
      quantity: [this.data.row?.inventoryRequest.quantity ?? null]
    });

    this.formErrors = new FormErrors(this.form);

    this.filteredSnacks = this.form.get('snackCtrl')?.valueChanges.pipe(
      untilDestroyed(this),
      startWith(''),
      map(snack => (snack ? this._filterSnacks(snack) : this.data.snacks.slice()))
    );
  }

  remove(snack: InventoryModel): void {
    const index = this.snackSelected.indexOf(snack);
    if (index >= 0) {
      this.snackSelected.splice(index, 1);
      this.disableInput = false;
      this.enableQuantity = false;
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.snackSelected.push(event.option.value);
    this.form.get('snackCtrl').setValue(null);
    this.disableInput = true;

    this.addOrRemoveValidatorsQuantity();
  }

  save(): void {
    console.log(this.form.getRawValue());
  }

  private addOrRemoveValidatorsQuantity(): void {
    const inventory = this.snackSelected[0];
    if (inventory.meeting) {
      this.form.get('quantity')?.clearValidators();
      this.form.get('quantity')?.updateValueAndValidity();
      this.form.get('quantity')?.setValue(null);
    } else {
      this.enableQuantity = true;

      this.form.get('quantity')?.addValidators([Validators.required, Validators.min(1),
        Validators.max(inventory.stock)]);
      this.form.get('quantity')?.updateValueAndValidity();
      this.form.get('quantity')?.setValue(1);
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
