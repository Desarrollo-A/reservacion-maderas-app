import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PackageModel } from "../../../../core/models/package.model";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { dateBeforeNow } from "../../../../shared/utils/form-validations";
import { ToastrService } from "ngx-toastr";
import { RequestPackageService } from "../../../../core/services/request-package.service";
import { getDateFormat } from "../../../../shared/utils/utils";
import { DriverService } from "../../../../core/services/driver.service";
import { CarService } from "../../../../core/services/car.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { switchMap } from "rxjs";
import { DriverModel } from "../../../../core/models/driver.model";
import { trackById } from "../../../../shared/utils/track-by";
import { CarModel } from "../../../../core/models/car.model";
import { ProposalPackageRequest } from "../../interfaces/proposal-package-request";

@UntilDestroy()
@Component({
  selector: 'app-proposal-request-package',
  templateUrl: './proposal-request-package.component.html',
  styleUrls: ['./proposal-request-package.component.scss']
})
export class ProposalRequestPackageComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  packages: PackageModel[] = [];
  drivers: DriverModel[] = [];
  cars: CarModel[] = [];
  isChecked = false;

  trackById = trackById;

  constructor(private dialogRef: MatDialogRef<ProposalRequestPackageComponent>,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private requestPackageService: RequestPackageService,
              private driverService: DriverService,
              private carService: CarService,
              @Inject(MAT_DIALOG_DATA) public data: PackageModel) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [null, [Validators.required]],
      driverId: [null, Validators.required],
      carId: [null, Validators.required],
      endDate: [null]
    });

    this.formErrors = new FormErrors(this.form);

    this.form.get('date').valueChanges.pipe(
      untilDestroyed(this),
      switchMap(date => this.driverService.getAvailablePackageRequest(this.data.officeId, getDateFormat(date)))
    ).subscribe(drivers => {
      this.drivers = drivers;
      if (drivers.length === 0) {
        this.toastrService.info('No hay choferes disponibles', 'Información');
      }
    });

    this.form.get('driverId').valueChanges.pipe(
      untilDestroyed(this),
      switchMap((driverId: number) => {
        this.form.patchValue({cardId: null});
        return this.carService.getAvailableCarsInRequestPackage(driverId, getDateFormat(this.form.get('date').value))
      })
    ).subscribe(cars => {
      this.cars = cars;
      if (cars.length === 0) {
        this.toastrService.info('No hay vehículos disponibles para el chofer seleccionado', 'Información');
      }
    });
  }

  get dateValue(): Date | undefined {
    return this.form.get('date').value;
  }

  updateDate(value: Date): void {
    const control = new FormControl(value);
    const error = dateBeforeNow(control);

    if (error !== null) {
      this.form.get('date').setValue(null);
      this.toastrService.warning('La fecha debe de ser igual o mayor a la actual', 'Validación');
      return;
    }

    this.requestPackageService.findAllByDateAndOffice(this.data.officeId, getDateFormat(value))
      .subscribe(packages => {
        this.packages = packages;
        this.form.get('date').setValue(value);
      });
  }

  save(): void {
    if (this.form.invalid) {
      if (!this.form.get('date').value) {
        this.toastrService.warning('Debe seleccionar una fecha del calendario','Validación');
      }

      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();

    if (this.isChecked) {
      if (formValues.date.getTime() > formValues.endDate.getTime()) {
        this.toastrService.warning('La fecha de llegada debe ser mayor o igual a la fecha propuesta','Validación');
        return;
      }
    }

    const data: ProposalPackageRequest = <ProposalPackageRequest> {
      requestId: this.data.requestId,
      startDate: getDateFormat(formValues.date),
      isDriverSelected: (!this.isChecked),
      packageId: this.data.id,
      carId: formValues.carId,
      driverId: formValues.driverId,
      endDate: (this.isChecked) ? getDateFormat(formValues.endDate) : null
    };

    this.requestPackageService.proposalRequest(data).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  changeToggle(): void {
    this.isChecked = !this.isChecked;

    if (this.isChecked) {
      this.form.get('driverId').clearValidators();
      this.form.get('carId').clearValidators();

      this.form.get('driverId').reset(null, {emitEvent: false});
      this.form.get('carId').reset(null);

      this.form.get('endDate').addValidators([Validators.required, dateBeforeNow])
    } else {
      this.form.get('endDate').clearValidators();

      this.form.get('endDate').reset(null);

      this.form.get('driverId').addValidators([Validators.required]);
      this.form.get('carId').addValidators([Validators.required]);
    }
  }
}
