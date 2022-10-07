import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TypeLookup } from 'src/app/core/enums/type-lookup';
import { Lookup } from 'src/app/core/interfaces/lookup';
import { LookupService } from 'src/app/core/services/lookup.service';
import { FormErrors } from 'src/app/shared/utils/form-error';
import { CarModel } from '../../model/car.model';
import { CarService } from '../../services/car.service';
import { trackById } from "../../../../shared/utils/track-by";

@Component({
  selector: 'app-change-status-car',
  templateUrl: './change-status-car.component.html',
  styleUrls: ['./change-status-car.component.scss']
})
export class ChangeStatusCarComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  status: Lookup[] = [];
  trackById = trackById;

  constructor(@Inject(MAT_DIALOG_DATA) public car: CarModel,
              private dialogRef: MatDialogRef<ChangeStatusCarComponent>,
              private lookupService: LookupService,
              private fb: FormBuilder,
              private carService: CarService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.loadStatus();

    this.form = this.fb.group({
      statusId: [this.car.statusId, Validators.required]
    });

    this.formErrors = new FormErrors(this.form);

  }

  get name(): string {
    return `${this.car.trademark} ${this.car.model}`;
  }

  loadStatus(): void {
    this.lookupService.findAllByType(TypeLookup.STATUS_CAR).subscribe(lookups => {
      this.status = lookups;
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {statusId} = this.form.getRawValue();
    this.carService.changeStatus(this.car.id, statusId).subscribe(() => {
      this.toastrService.success('Registro actualizado', 'Proceso exitoso');
      this.dialogRef.close(true);
    });
  }
}
