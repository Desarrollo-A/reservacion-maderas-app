import { Component, Input, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { RequestDriverModel } from "../../../../core/models/request-driver.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { DriverModel } from "../../../../core/models/driver.model";
import { CarModel } from "../../../../core/models/car.model";
import { trackById } from "../../../../shared/utils/track-by";
import { DriverService } from "../../../../core/services/driver.service";
import { CarService } from "../../../../core/services/car.service";
import { getFullDateFormat } from "../../../../shared/utils/utils";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";

@UntilDestroy()
@Component({
  selector: 'app-driver-request-assign',
  templateUrl: './driver-request-assign.component.html',
  styleUrls: ['./driver-request-assign.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class DriverRequestAssignComponent implements OnInit {
  @Input()
  requestDriver: RequestDriverModel;

  form: FormGroup;
  formErrors: FormErrors;

  drivers: DriverModel[] = [];
  cars: CarModel[] = [];
  trackById = trackById;

  constructor(private fb: FormBuilder,
              private driverService: DriverService,
              private carService: CarService,
              private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      driverId: [null, Validators.required],
      carId: [null, Validators.required]
    });

    this.formErrors = new FormErrors(this.form);

    this.form.get('driverId')?.valueChanges.pipe(
      untilDestroyed(this),
      switchMap((driverId: number) => {
        const { request: { startDate, endDate, people } } = this.requestDriver;
        const parseStartDate = getFullDateFormat(new Date(startDate));
        const parseEndDate = getFullDateFormat(new Date(endDate));

        this.form.patchValue({cardId: null});
        return this.carService.getAvailableDriverRequest(driverId, parseStartDate, parseEndDate, people);
      })
    ).subscribe(cars => {
      this.cars = cars;
      if (cars.length === 0) {
        this.toastrService.info('No hay vehículos disponibles para el chofer seleccionado', 'Información');
      }
    });

    this.loadDrivers();
  }

  private loadDrivers(): void {
    const { officeId, request: { startDate, endDate } } = this.requestDriver;
    const parseStartDate = getFullDateFormat(new Date(startDate));
    const parseEndDate = getFullDateFormat(new Date(endDate));
    this.driverService.getAvailableDriverRequest(officeId, parseStartDate, parseEndDate).subscribe(drivers => {
      this.drivers = drivers;
      (drivers.length === 0)
        ? this.toastrService.info('No hay choferes disponibles', 'Información')
        : this.toastrService.info('Selecciona un chofer y un vehículo', 'Información');
    });
  }
}
