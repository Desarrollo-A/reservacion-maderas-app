import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { dateBeforeNow } from "../../../../shared/utils/form-validations";
import { ToastrService } from "ngx-toastr";
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";
import { compareDate, getDateFormat, getFullDateFormat } from "../../../../shared/utils/utils";
import { DriverModel } from "../../../../core/models/driver.model";
import { DriverService } from "../../../../core/services/driver.service";
import { trackById } from "../../../../shared/utils/track-by";
import { CarModel } from "../../../../core/models/car.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { InputDataProposalDriverRequest } from "../../interfaces/input-data-proposal-driver-request";
import { map, tap } from "rxjs";
import { DatesModel } from "../../../../core/models/dates.model";
import { ProposalDriverRequest } from "../../interfaces/proposal-driver-request";
import { RequestDriverService } from "../../../../core/services/request-driver.service";

@UntilDestroy()
@Component({
  selector: 'app-proposal-request-driver',
  templateUrl: './proposal-request-driver.component.html',
  styleUrls: ['./proposal-request-driver.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProposalRequestDriverComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  drivers: DriverModel[] = [];
  cars: CarModel[] = [];
  schedules: DatesModel[] = [];
  trackById = trackById;

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      return this.data.dates.some(d => compareDate(d, cellDate)) ? 'highligh-date-class' : '';
    }

    return '';
  };

  constructor(private dialogRef: MatDialogRef<ProposalRequestDriverComponent>,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private driverService: DriverService,
              private requestDriverService: RequestDriverService,
              @Inject(MAT_DIALOG_DATA) public data: InputDataProposalDriverRequest) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [null, [Validators.required]],
      driverId: [null, [Validators.required]],
      carId: [null, [Validators.required]],
      scheduleIndex: [null, [Validators.required]]
    });

    this.formErrors = new FormErrors(this.form);

    this.form.get('driverId').valueChanges.pipe(
      untilDestroyed(this),
      tap(() => {
        this.cars = [];
        this.schedules = [];
        this.form.patchValue({carId: null, scheduleIndex: null}, {emitEvent: false});
      }),
      map<number, CarModel[]>(driverId => this.drivers.find(driver => driver.id === driverId).availableCars)
    ).subscribe(cars => this.cars = cars);

    this.form.get('carId').valueChanges.pipe(
      untilDestroyed(this),
      tap(() => {
        this.schedules = [];
        this.form.patchValue({scheduleIndex: null}, {emitEvent: false});
      }),
      map<number, DatesModel[]>(carId => this.cars.find(car => car.id === carId).availableSchedules)
    ).subscribe(schedules => this.schedules = schedules);
  }

  get dateValue(): Date | undefined {
    return this.form.get('date').value;
  }

  updateDate(value: Date): void {
    const control = new FormControl(value);
    const error = dateBeforeNow(control);

    this.drivers = [];
    this.cars = [];
    this.schedules = [];
    this.form.patchValue({driverId: null, carId: null, scheduleIndex: null}, {emitEvent: false});

    if (error !== null) {
      this.form.get('date').setValue(null);
      this.toastrService.warning('La fecha debe de ser igual o mayor a la actual', 'Validación');
      return;
    }

    this.driverService.getAvailableDriversProposalRequest(this.data.requestDriver.requestId, getDateFormat(value))
      .subscribe(drivers => {
        this.drivers = drivers;
        this.form.get('date').setValue(value);
        if (drivers.length === 0) {
          this.toastrService.info('No hay choferes disponibles para este día', 'Información');
        }
      });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    const proposalData: ProposalDriverRequest = {
      requestId: this.data.requestDriver.requestId,
      driverId: formValues.driverId,
      carId: formValues.carId,
      startDate: getFullDateFormat(this.schedules[formValues.scheduleIndex].startDate),
      endDate: getFullDateFormat(this.schedules[formValues.scheduleIndex].endDate)
    };

    this.requestDriverService.proposalRequest(proposalData).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
