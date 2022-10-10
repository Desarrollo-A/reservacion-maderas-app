import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CarService } from "../../../../core/services/car.service";
import { ToastrService } from "ngx-toastr";
import { CarModel } from "../../../../core/models/car.model";

@Component({
  selector: 'app-car-create-update',
  templateUrl: './car-create-update.component.html',
  styleUrls: ['./car-create-update.component.scss']
})
export class CarCreateUpdateComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  constructor(private dialogRef: MatDialogRef<CarCreateUpdateComponent>,
              private fb: FormBuilder,
              private carService: CarService,
              private toastrService: ToastrService,
              @Inject(MAT_DIALOG_DATA) public data?: CarModel) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      businessName: [this.data?.businessName ?? '', [Validators.required, Validators.minLength(5),
        Validators.maxLength(191)]],
      trademark: [this.data?.trademark ?? '', [Validators.required, Validators.minLength(4),
        Validators.maxLength(100)]],
      model: [this.data?.model ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      color: [this.data?.color ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      licensePlate: [this.data?.licensePlate ?? '', [Validators.required, Validators.minLength(3),
        Validators.maxLength(10)]],
      serie: [this.data?.serie ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      circulationCard: [this.data?.circulationCard ?? '', [Validators.required, Validators.minLength(3),
        Validators.maxLength(10)]],
      people: [this.data?.people ?? '', [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.data) {
      const car: CarModel = this.form.getRawValue();
      this.carService.store(car).subscribe(() => {
        this.toastrService.success('Registro agregado', 'Proceso exitoso');
        this.dialogRef.close(true);
      });
    } else {
      const car: CarModel = {
        id: this.data.id,
        ... this.form.getRawValue()
      };

      this.carService.update(this.data.id, car).subscribe(() => {
        this.toastrService.success('Registro actualizado', 'Proceso exitoso');
        this.dialogRef.close(true);
      });
    }
  }
}
