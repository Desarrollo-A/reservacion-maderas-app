import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InventoryModel } from "../../models/inventory.model";
import { LookupService } from "../../../../core/services/lookup.service";
import { InventoryService } from "../../services/inventory.service";
import { ToastrService } from "ngx-toastr";
import { Lookup } from "../../../../core/interfaces/lookup";
import { forkJoin } from "rxjs";
import { TypeLookup } from "../../../../core/enums/type-lookup";
import { InventoryTypeLookup } from "../../enums/inventory-type.lookup";

@Component({
  selector: 'app-item-create-update',
  templateUrl: './item-create-update.component.html',
  styleUrls: ['./item-create-update.component.scss']
})
export class ItemCreateUpdateComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  typeInventories: Lookup[] = [];
  unitInventories: Lookup[] = [];
  typeCafeteria: Lookup;

  constructor(private dialogRef: MatDialogRef<ItemCreateUpdateComponent>,
              private lookupService: LookupService,
              private fb: FormBuilder,
              private inventoryService: InventoryService,
              private toastrService: ToastrService,
              @Inject(MAT_DIALOG_DATA) public data?: InventoryModel) {}

  ngOnInit(): void {
    this.loadTypeAndUnitInventories();

    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [this.data?.description ?? null],
      minimumStock: [this.data?.minimumStock ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      typeId: [this.data?.typeId ?? null, [Validators.required]],
      unitId: [this.data?.unitId ?? null, [Validators.required]],
      meeting: [this.data?.meeting ?? null, [Validators.min(1), Validators.max(25)]],
      stock: [null],
      status: [this.data?.status ?? null]
    });

    if (!this.data) {
      this.form.get('stock')?.addValidators([Validators.required, Validators.min(0), Validators.max(100)]);
    } else {
      this.form.get('status')?.addValidators([Validators.required]);
    }

    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.data) {
      const inventory: InventoryModel = this.form.getRawValue();
      this.inventoryService.store(inventory).subscribe(() => {
        this.toastrService.success('Registro agregado', 'Proceso exitoso');
        this.dialogRef.close(true);
      });
    } else {
      const inventory: InventoryModel = {
        id: this.data.id,
        ... this.form.getRawValue()
      };

      this.inventoryService.update(this.data.id, inventory).subscribe(() => {
        this.toastrService.success('Registro actualizado', 'Proceso exitoso');
        this.dialogRef.close(true);
      })
    }
  }

  loadTypeAndUnitInventories(): void {
    forkJoin([this.lookupService.findAllByType(TypeLookup.INVENTORY_TYPE), this.lookupService.findAllByType(TypeLookup.UNIT_TYPE)])
      .subscribe(([typeInventories, unitInventories]) => {
        this.typeInventories = typeInventories;
        this.unitInventories = unitInventories;
        this.typeCafeteria = this.typeInventories.find(lookup => lookup.name === InventoryTypeLookup.COFFEE);
      });
  }
}
