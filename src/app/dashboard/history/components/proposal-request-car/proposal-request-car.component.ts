import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { CarModel } from "../../../../core/models/car.model";
import { DatesModel } from "../../../../core/models/dates.model";
import { trackById } from "../../../../shared/utils/track-by";
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";
import { compareDate, getDateFormat, getFullDateFormat } from "../../../../shared/utils/utils";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CarService } from "../../../../core/services/car.service";
import { RequestCarService } from "../../../../core/services/request-car.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { map, tap } from "rxjs";
import { dateBeforeNow } from "../../../../shared/utils/form-validations";
import { InputDataProposalCarRequest } from "../../interfaces/input-data-proposal-car-request";
import { ProposalCarDriverRequest } from "../../interfaces/proposal-car-driver-request";

@UntilDestroy()
@Component({
  selector: 'app-proposal-request-car',
  templateUrl: './proposal-request-car.component.html',
  styleUrls: ['./proposal-request-car.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProposalRequestCarComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  cars: CarModel[] = [];
  schedules: DatesModel[] = [];
  trackById = trackById;

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      return this.data.dates.some(d => compareDate(d, cellDate)) ? 'highligh-date-class' : '';
    }

    return '';
  };

  constructor(private dialogRef: MatDialogRef<ProposalRequestCarComponent>,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private carService: CarService,
              private requestCarService: RequestCarService,
              @Inject(MAT_DIALOG_DATA) public data: InputDataProposalCarRequest) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [null, [Validators.required]],
      carId: [null, [Validators.required]],
      scheduleIndex: [null, [Validators.required]]
    });

    this.formErrors = new FormErrors(this.form);

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

    this.cars = [];
    this.schedules = [];
    this.form.patchValue({carId: null, scheduleIndex: null}, {emitEvent: false});

    if (error !== null) {
      this.form.get('date').setValue(null);
      this.toastrService.warning('La fecha debe de ser igual o mayor a la actual', 'Validación');
      return;
    }

    this.carService.getAvailableCarsProposalRequest(this.data.requestCar.requestId, getDateFormat(value))
      .subscribe(cars => {
        this.cars = cars;
        this.form.get('date').setValue(value);
        if (cars.length === 0) {
          this.toastrService.info('No hay vehículos disponibles para este día', 'Información');
        }
      });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    const proposalData: ProposalCarDriverRequest = {
      requestId: this.data.requestCar.requestId,
      carId: formValues.carId,
      startDate: getFullDateFormat(this.schedules[formValues.scheduleIndex].startDate),
      endDate: getFullDateFormat(this.schedules[formValues.scheduleIndex].endDate)
    };

    this.requestCarService.proposalRequest(proposalData).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
