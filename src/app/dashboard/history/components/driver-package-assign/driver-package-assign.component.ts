import { Component, Input, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { trackById } from "../../../../shared/utils/track-by";
import { DriverModel } from "../../../../core/models/driver.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { DriverService } from "../../../../core/services/driver.service";
import { PackageModel } from "../../../../core/models/package.model";
import { getDateFormat } from "../../../../shared/utils/utils";
import { CarModel } from "../../../../core/models/car.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { forkJoin, switchMap } from "rxjs";
import { RequestPackageService } from "../../../../core/services/request-package.service";

@UntilDestroy()
@Component({
  selector: 'app-driver-package-assign',
  templateUrl: './driver-package-assign.component.html',
  styleUrls: ['./driver-package-assign.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class DriverPackageAssignComponent implements OnInit {
  @Input()
  requestPackage: PackageModel;

  form: FormGroup;
  formErrors: FormErrors;

  drivers: DriverModel[] = [];
  cars: CarModel[] = [];
  approvedPackagesHistory: PackageModel[] = [];
  isChecked = false;

  trackById = trackById;
  constructor(private fb: FormBuilder,
              private driverService: DriverService,
              private requestPackageService: RequestPackageService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      driverId: [null, Validators.required],
      carId: [null, Validators.required],
      trackingCode: [null],
      urlTracking: [null]
    });

    this.formErrors = new FormErrors(this.form);

    this.form.get('driverId')?.valueChanges.pipe(
      untilDestroyed(this),
      switchMap((driverId: number) => {
        this.form.get('carId')?.setValue(null);
        return forkJoin([
          this.driverService.findById(driverId),
          this.requestPackageService.getPackagesByDriverId(driverId, getDateFormat(new Date(this.requestPackage.request.startDate)))
        ]);
      })
    ).subscribe(([drivers, packages]) => {
      this.cars = drivers.cars;
      this.approvedPackagesHistory = packages;
    });

    this.loadDrivers();
  }

  changeToggle(): void {
    this.isChecked = !this.isChecked;

    if (this.isChecked) {
      this.form.get('driverId')?.clearValidators();
      this.form.get('carId')?.clearValidators();

      this.form.get('trackingCode')?.addValidators([Validators.required, Validators.minLength(10),
        Validators.maxLength(25)]);
      this.form.get('urlTracking')?.addValidators([Validators.required, Validators.minLength(10),
        Validators.maxLength(255)]);
    } else {
      this.form.get('trackingCode')?.clearValidators();
      this.form.get('urlTracking')?.clearValidators();

      this.form.get('driverId')?.addValidators([Validators.required]);
      this.form.get('carId')?.addValidators([Validators.required]);
    }

    this.form.reset({}, {emitEvent: false});
  }

  private loadDrivers(): void {
    const { officeId, request: { startDate } } = this.requestPackage;
    this.driverService.getAvailablePackageRequest(officeId, getDateFormat(new Date(startDate))).subscribe(drivers => {
      this.drivers = drivers;
    });
  }
}
