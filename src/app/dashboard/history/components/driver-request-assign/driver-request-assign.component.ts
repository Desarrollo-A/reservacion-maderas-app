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
import { getDateFormat, getFullDateFormat } from "../../../../shared/utils/utils";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { switchMap } from "rxjs";

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
              private carService: CarService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      driverId: [null, Validators.required],
      carId: [null, Validators.required]
    });

    this.formErrors = new FormErrors(this.form);

    this.form.get('driverId')?.valueChanges.pipe(
      untilDestroyed(this),
      switchMap((driverId: number) => {
        const { request: { startDate, endDate } } = this.requestDriver;
        const parseStartDate = getFullDateFormat(new Date(startDate));
        const parseEndDate = getFullDateFormat(new Date(endDate));

        this.form.patchValue({cardId: null});
        return this.carService.getAvailableDriverRequest(driverId, parseStartDate, parseEndDate);
      })
    ).subscribe(cars => this.cars = cars);

    this.loadDrivers();
  }

  private loadDrivers(): void {
    const { officeId, request: { startDate, endDate } } = this.requestDriver;
    const parseStartDate = getDateFormat(new Date(startDate));
    const parseEndDate = getDateFormat(new Date(endDate));
    this.driverService.getAvailableDriverRequest(officeId, parseStartDate, parseEndDate).subscribe(drivers => {
      this.drivers = drivers;
    });
  }
}
