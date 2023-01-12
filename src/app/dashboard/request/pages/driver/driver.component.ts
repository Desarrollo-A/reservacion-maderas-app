import { Component, OnInit, ViewChild } from '@angular/core';
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { StateModel } from "../../../../core/models/state.model";
import { trackById } from "../../../../shared/utils/track-by";
import { OfficeModel } from "../../../../core/models/office.model";
import { StateService } from "../../../../core/services/state.service";
import { AddressComponent } from "../../../../shared/components/address/address.component";
import { OfficeService } from "../../../../core/services/office.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { debounceTime, distinctUntilChanged, of, switchMap, tap, forkJoin } from "rxjs";
import {
  dateAfter30Days,
  dateBeforeNow,
  endDateIsAfterToStartDate,
  endTimeIsAfterToStarTimeWithDates,
  sizeFile
} from "../../../../shared/utils/form-validations";
import { getDateFormat, roundedTime } from "../../../../shared/utils/utils";
import {
  EmailRequestTableComponent
} from "../../../../shared/components/email-request/components/email-request-table/email-request-table.component";
import { RequestDriverService } from "../../../../core/services/request-driver.service";
import { AddressModel } from "../../../../core/models/address.model";
import { RequestDriverModel } from "../../../../core/models/request-driver.model";
import { RequestModel } from "../../../../core/models/request.model";
import { ToastrService } from "ngx-toastr";

@UntilDestroy()
@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class DriverComponent implements OnInit {
  @ViewChild('emailRequestTableComponent')
  emailRequestTableComponent: EmailRequestTableComponent;
  @ViewChild('pickupAddress')
  pickupAddressComponent: AddressComponent;
  @ViewChild('arrivalAddress')
  arrivalAddressComponent: AddressComponent;

  form: FormGroup;
  formErrors: FormErrors;

  states: StateModel[] = [];
  offices: OfficeModel[] = [];
  allOffices: OfficeModel[] = [];

  trackById = trackById;

  constructor(private fb: FormBuilder,
              private stateService: StateService,
              private officeService: OfficeService,
              private requestDriverService: RequestDriverService,
              private toastrService: ToastrService) {}

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
      authorizationFile: [null, Validators.required],
      authorizationFileSrc: [null, sizeFile(3000000)],
      comment: [null, [Validators.required, Validators.maxLength(2500)]]
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
          ? this.officeService.getOfficeByStateWithDriverAndCar(state, this.form.get('people')?.value)
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
          ? this.officeService.getOfficeByStateWithDriverAndCar(this.form.get('state')?.value, people)
          : of([]);
      })
    ).subscribe(offices => this.offices = offices);
  }

  roundedTime(field: string, value: string): void {
    this.form.get(field)?.setValue(roundedTime(value));
  }

  changeFile(file: File): void {
    this.form.patchValue({
      authorizationFileSrc: file
    });
  }

  save(): void {
    if (this.form.invalid || this.pickupAddressComponent.isInvalidForm() || this.arrivalAddressComponent.isInvalidForm()) {
      this.form.markAllAsTouched();
      this.pickupAddressComponent.markAllAsTouched();
      this.arrivalAddressComponent.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    const pickupAddress: AddressModel = {
                                          ...this.pickupAddressComponent.form.value,
                                          isExternal: this.pickupAddressComponent.isExternalControl.value
                                        };
    const arrivalAddress: AddressModel =  {
                                            ...this.arrivalAddressComponent.form.value,
                                            isExternal: this.arrivalAddressComponent.isExternalControl.value
                                          };
    const requestDriver: RequestDriverModel = <RequestDriverModel>{
      pickupAddress,
      arrivalAddress,
      pickupAddressId: this.pickupAddressComponent.formAddressInternal.value.officeAddressId,
      arrivalAddressId: this.arrivalAddressComponent.formAddressInternal.value.officeAddressId,
      officeId: formValues.officeId
    };
    const request: RequestModel = <RequestModel>{
      title: formValues.title,
      startDate: `${getDateFormat(formValues.startDate)} ${formValues.startTime}`,
      endDate: `${getDateFormat(formValues.endDate)} ${formValues.endTime}`,
      people: formValues.people,
      comment: formValues.comment,
      addGoogleCalendar: formValues.addGoogleCalendar,
      requestDriver,
      requestEmail: this.emailRequestTableComponent.emails,
    };

    this.requestDriverService.store(request).pipe(
      switchMap(res => this.requestDriverService.uploadFile(res.id, formValues.authorizationFileSrc))
    ).subscribe(() => {
      this.form.reset({
        addGoogleCalendar: false
      }, { emitEvent: false });
      this.pickupAddressComponent.clearData();
      this.arrivalAddressComponent.clearData();
      this.emailRequestTableComponent.clearData();

      this.toastrService.success('Solicitud creada', 'Proceso existoso');
    });
  }

  private getAllStates(): void {
    forkJoin([this.stateService.findAll(), this.officeService.getAllOffices()]).subscribe(([states, offices]) => {
      this.states = states;
      this.allOffices = offices;
    });
  }
}
