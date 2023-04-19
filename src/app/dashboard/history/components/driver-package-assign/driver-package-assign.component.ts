import { Component, Input, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { trackById } from "../../../../shared/utils/track-by";
import { DriverModel } from "../../../../core/models/driver.model";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { PackageModel } from "../../../../core/models/package.model";
import { getDateFormat } from "../../../../shared/utils/utils";
import { CarModel } from "../../../../core/models/car.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { forkJoin, switchMap } from "rxjs";
import { RequestPackageService } from "../../../../core/services/request-package.service";
import { dateBeforeNow } from "../../../../shared/utils/form-validations";
import { CarService } from "../../../../core/services/car.service";
import { DriverService } from "../../../../core/services/driver.service";
import { ToastrService } from "ngx-toastr";

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
  externalDelivery = new FormControl(false);

  drivers: DriverModel[] = [];
  cars: CarModel[] = [];
  approvedPackagesHistory: PackageModel[] = [];

  trackById = trackById;
  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private carService: CarService,
    private requestPackageService: RequestPackageService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDrivers();

    this.form = this.fb.group({
      driverId: [null, Validators.required],
      carId: [null, Validators.required],
      companyName: [null],
      trackingCode: [null],
      urlTracking: [null],
      endDate: [null],
      weight: [null]
    });

    if (this.requestPackage.proposalPackage) {
      this.externalDelivery.setValue(true);
      this.externalDelivery.disable();

      this.addValidatorsToExternalPackage();

      this.form.get('endDate').setValue(new Date(this.requestPackage.request.endDate));
      this.form.get('endDate').disable();
    }

    this.formErrors = new FormErrors(this.form);

    this.form.get('driverId')?.valueChanges.pipe(
      untilDestroyed(this),
      switchMap((driverId: number) => {
        this.form.patchValue({cardId: null});
        return forkJoin([
          this.carService.getAvailableCarsInRequestPackage(driverId, getDateFormat(new Date(this.requestPackage.request.startDate))),
          this.requestPackageService.getPackagesByDriverId(driverId, getDateFormat(new Date(this.requestPackage.request.startDate)))
        ]);
      })
    ).subscribe(([cars, packages]) => {
      this.cars = cars;
      this.approvedPackagesHistory = packages;
      if (cars.length === 0) {
        this.toastrService.info('No hay vehículos disponibles para el chofer seleccionado', 'Información');
      }
    });

    this.externalDelivery.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.changeToggle(value));
  }

  changeToggle(value: boolean): void {
    if (value) {
      this.addValidatorsToExternalPackage();

      this.form.get('endDate')?.addValidators([
        Validators.required,
        dateBeforeNow
      ]);

    } else {
      this.form.get('companyName')?.clearValidators();
      this.form.get('trackingCode')?.clearValidators();
      this.form.get('urlTracking')?.clearValidators();
      this.form.get('endDate')?.clearValidators();
      this.form.get('weight')?.clearValidators();

      this.form.get('driverId')?.addValidators([Validators.required]);
      this.form.get('carId')?.addValidators([Validators.required]);
    }

    this.form.reset({}, {emitEvent: false});
  }

  private loadDrivers(): void {
    const { officeId, request: { startDate } } = this.requestPackage;
    this.driverService.getAvailablePackageRequest(officeId, getDateFormat(new Date(startDate))).subscribe(drivers => {
      this.drivers = drivers;
      if (drivers.length === 0) {
        this.toastrService.info('No hay choferes disponibles', 'Información');
      }
    });
  }

  private addValidatorsToExternalPackage(): void {
    this.form.get('driverId')?.clearValidators();
    this.form.get('carId')?.clearValidators();

    this.form.get('companyName')?.addValidators([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(75)
    ]);
    this.form.get('trackingCode')?.addValidators([
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(25)
    ]);
    this.form.get('urlTracking')?.addValidators([
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(255)
    ]);
    this.form.get('weight')?.addValidators([
      Validators.required,
      Validators.min(0.01),
      Validators.max(999999)
    ]);
  }
}
