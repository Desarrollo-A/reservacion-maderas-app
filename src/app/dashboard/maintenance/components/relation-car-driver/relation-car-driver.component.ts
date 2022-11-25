import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CarModel } from 'src/app/core/models/car.model';
import { DriverModel } from 'src/app/core/models/driver.model';
import { CarService } from 'src/app/core/services/car.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { FormErrors } from 'src/app/shared/utils/form-error';
import { trackById } from 'src/app/shared/utils/track-by';

@Component({
  selector: 'app-relation-car-driver',
  templateUrl: './relation-car-driver.component.html',
  styleUrls: ['./relation-car-driver.component.scss']
})
export class RelationCarDriverComponent implements OnInit {

  form: FormGroup;
  formErrors: FormErrors;
  carsAvailables: CarModel[] = [];
  trackById = trackById;

  constructor(private dialogRef: MatDialogRef<RelationCarDriverComponent>,
              private fb: FormBuilder,
              private carService: CarService,
              private driverService: DriverService,
              private toastrService: ToastrService,
              @Inject(MAT_DIALOG_DATA) public driverData: DriverModel) { }

  ngOnInit(): void {
    this.loadCarsAvailables();
    this.form = this.fb.group({
      carId: [this.driverData.cars[0]?.id ?? null, [Validators.required]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  loadCarsAvailables(): void{
    this.carService.findAllAvailableByDriverId(this.driverData.id).subscribe(dataCar  =>  {
      this.carsAvailables = dataCar;
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const {carId} = this.form.getRawValue();
    
    this.driverService.insertDriverCar(carId, this.driverData.id).subscribe(() =>{
      this.toastrService.success('Vehículo asignado correctamente', 'Proceso exitoso');
      this.dialogRef.close(true);
    })    
  }

}
  