import { Component, OnInit, ViewChild } from '@angular/core';
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { trackById } from "../../../../shared/utils/track-by";
import { OfficeModel } from "../../../../core/models/office.model";
import { StateModel } from "../../../../core/models/state.model";
import { StateService } from "../../../../core/services/state.service";
import { OfficeService } from "../../../../core/services/office.service";
import { ToastrService } from "ngx-toastr";
import { RequestCarService } from "../../../../core/services/request-car.service";
import { getDateFormat, getTimeFormat, roundedTime } from "../../../../shared/utils/utils";
import {
  dateAfter30Days,
  dateBeforeNow,
  endDateIsAfterToStartDate,
  endTimeIsAfterToStarTimeWithDates,
  termsConditions
} from "../../../../shared/utils/form-validations";
import { debounceTime, distinctUntilChanged, of, switchMap, tap } from "rxjs";
import {
  EmailRequestTableComponent
} from "../../../../shared/components/email-request/components/email-request-table/email-request-table.component";
import { RequestCarModel } from "../../../../core/models/request-car.model";
import { RequestModel } from "../../../../core/models/request.model";
import { MatDialog } from "@angular/material/dialog";
import {
  TermsConditionsRequestCarComponent
} from "../../../../shared/components/terms-conditions/terms-conditions-request-car/terms-conditions-request-car.component";

@UntilDestroy()
@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class CarComponent implements OnInit {
  @ViewChild('emailRequestTableComponent')
  emailRequestTableComponent: EmailRequestTableComponent;
  form: FormGroup;
  formErrors: FormErrors;

  states: StateModel[] = [];
  offices: OfficeModel[] = [];
  renderTimepicker = false;

  trackById = trackById;

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private officeService: OfficeService,
    private requestCarService: RequestCarService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllStates();

    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      people: [null, [Validators.required, Validators.min(2), Validators.max(10)]],
      state: [null, Validators.required],
      officeId: [null, Validators.required],
      startDate: [null, [Validators.required, dateBeforeNow, dateAfter30Days]],
      endDate: [null, [Validators.required]],
      addGoogleCalendar: [false],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      comment: [null, [Validators.required, Validators.maxLength(2500)]],
      termsConditions: [false, termsConditions]
    }, {
      validators: [
        endDateIsAfterToStartDate('startDate', 'endDate'),
        endTimeIsAfterToStarTimeWithDates('startDate', 'endDate', 'startTime', 'endTime')
      ]
    });

    this.formErrors = new FormErrors(this.form);

    this.form.get('state')?.valueChanges.pipe(
      untilDestroyed(this),
      tap(() => this.form.get('officeId')?.reset()),
      switchMap(state => {
        return (state !== null && this.form.get('people')?.value !== null)
          ? this.officeService.getOfficeByStateWithCar(state, this.form.get('people')?.value)
          : of([]);
      })
    ).subscribe(offices => this.offices = offices);

    this.form.get('people')?.valueChanges.pipe(
      untilDestroyed(this),
      debounceTime(750),
      distinctUntilChanged(),
      tap(() => this.form.get('officeId')?.reset()),
      switchMap(people => {
        return (people !== null && this.form.get('state')?.value !== null)
          ? this.officeService.getOfficeByStateWithCar(this.form.get('state')?.value, people)
          : of([]);
      })
    ).subscribe(offices => this.offices = offices);
  }

  roundedTime(field: string, value: Date): void {
    this.form.get(field)?.setValue(roundedTime(value));
  }

  termsAndConditions(): void {
    this.dialog.open(TermsConditionsRequestCarComponent);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();

    const requestCar: RequestCarModel = <RequestCarModel>{
      officeId: formValues.officeId
    };
    const request: RequestModel = <RequestModel>{
      title: formValues.title,
      startDate: `${getDateFormat(formValues.startDate)} ${getTimeFormat(formValues.startTime)}`,
      endDate: `${getDateFormat(formValues.endDate)} ${getTimeFormat(formValues.endTime)}`,
      people: formValues.people,
      comment: formValues.comment,
      addGoogleCalendar: formValues.addGoogleCalendar,
      requestCar,
      requestEmail: this.emailRequestTableComponent.emails,
    };

    this.requestCarService.store(request).subscribe(() => {
      this.form.reset({
        addGoogleCalendar: false
      }, { emitEvent: false });

      this.renderTimepicker = true;
      setTimeout(() => {
        this.renderTimepicker = false;
      }, 1);

      this.emailRequestTableComponent.clearData();

      this.toastrService.success('Solicitud creada', 'Proceso existoso');
    });
  }

  private getAllStates(): void {
    this.stateService.findAll().subscribe(states => {
      this.states = states;
    });
  }
}
