import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { StateModel } from "../../../../core/models/state.model";
import { trackById } from "../../../../shared/utils/track-by";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OfficeModel } from "../../../../core/models/office.model";
import { LookupService } from "../../../../core/services/lookup.service";
import { Lookup } from "../../../../core/interfaces/lookup";
import { StateService } from "../../../../core/services/state.service";
import { forkJoin } from "rxjs";
import { TypeLookup } from "../../../../core/enums/type-lookup";
import { OfficeService } from "../../../../core/services/office.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-office-create-update',
  templateUrl: './office-create-update.component.html',
  styleUrls: ['./office-create-update.component.scss']
})
export class OfficeCreateUpdateComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  states: StateModel[] = [];
  countries: Lookup[] = [];

  trackById = trackById;

  constructor(
    private dialogRef: MatDialogRef<OfficeCreateUpdateComponent>,
    private fb: FormBuilder,
    private lookupService: LookupService,
    private stateService: StateService,
    private officeService: OfficeService,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data?: OfficeModel
  ) { }

  ngOnInit(): void {
    this.loadData();

    this.form = this.fb.group({
      name: [this.data?.name ?? null, [
        Validators.required, Validators.minLength(3), Validators.maxLength(120)
      ]],
      stateId: [this.data?.stateId || null, [Validators.required]],
      status: [this.data?.status || null],
      address: this.fb.group({
        street: [this.data?.address?.street ?? null, [
          Validators.required, Validators.minLength(5), Validators.maxLength(150)
        ]],
        numExt: [this.data?.address?.numExt ?? null, [Validators.required, Validators.maxLength(50)]],
        numInt: [this.data?.address?.numInt ?? null, [Validators.minLength(1), Validators.maxLength(50)]],
        suburb: [this.data?.address?.suburb ?? null, [
          Validators.required, Validators.minLength(5), Validators.maxLength(120)
        ]],
        postalCode: [this.data?.address?.postalCode ?? null, [
          Validators.required, Validators.minLength(3), Validators.maxLength(25)
        ]],
        state: [this.data?.address?.state ?? null, [
          Validators.required, Validators.minLength(3), Validators.maxLength(100)
        ]],
        countryId: [this.data?.address?.countryId, [Validators.required]]
      })
    });

    if (this.data) {
      this.form.get('status').addValidators(Validators.required);
    }

    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.data) {
      const office: OfficeModel = this.form.getRawValue();
      this.officeService.store(office).subscribe(() => {
        this.toastrService.success('Registro agregado', 'Proceso exitoso');
        this.dialogRef.close(true);
      });
    } else {
      const office: OfficeModel = {
        id: this.data.id,
        addressId: this.data.addressId,
        ... this.form.getRawValue()
      };
      this.officeService.update(this.data.id, office).subscribe(() => {
        this.toastrService.success('Registro actualizado', 'Proceso exitoso');
        this.dialogRef.close(true);
      });
    }
  }

  private loadData(): void {
    forkJoin([
      this.stateService.findAll(),
      this.lookupService.findAllByType(TypeLookup.COUNTRY_ADDRESS)
    ]).subscribe(([states, countries]) => {
      this.states = states;
      this.countries = countries;
    });
  }
}
