import { Component, OnInit, ViewChild } from '@angular/core';
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { StateModel } from "../../../../core/models/state.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { StateService } from "../../../../core/services/state.service";
import { forkJoin, switchMap, tap } from "rxjs";
import { RoomModel } from "../../../../core/models/room.model";
import { RoomService } from "../../../../core/services/room.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ToastrService } from "ngx-toastr";
import { dateAfter30Days, dateBeforeNow, workingHours } from "../../../../shared/utils/form-validations";
import {
  compareTimes,
  getDateFormat, getTimeFormat,
  removeError,
  roundedTime,
  weekendsOffCalendar
} from "../../../../shared/utils/utils";
import { LookupService } from "../../../../core/services/lookup.service";
import { Lookup } from "../../../../core/interfaces/lookup";
import { TypeLookup } from "../../../../core/enums/type-lookup";
import { RequestRoomModel } from "../../../../core/models/request-room.model";
import { RequestModel } from "../../../../core/models/request.model";
import { RequestRoomService } from "../../../../core/services/request-room.service";
import { trackById } from "../../../../shared/utils/track-by";
import {
  EmailRequestTableComponent
} from "../../../../shared/components/email-request/components/email-request-table/email-request-table.component";

@UntilDestroy()
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class RoomComponent implements OnInit {
  /*@ViewChild('phoneRequestTableComponent')
  phoneRequestTableComponent: PhoneRequestTableComponent;*/
  @ViewChild('emailRequestTableComponent')
  emailRequestTableComponent: EmailRequestTableComponent;

  form: FormGroup;
  formErrors: FormErrors;

  states: StateModel[] = [];
  rooms: RoomModel[] = [];
  meetingTypes: Lookup[] = [];
  renderTimepicker = false;

  trackById = trackById;
  weekendsOff = weekendsOffCalendar;

  constructor(private fb: FormBuilder,
              private stateService: StateService,
              private lookupService: LookupService,
              private roomService: RoomService,
              private requestRoomService: RequestRoomService,
              private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.getStatesAndMeetingTypes();

    this.form = this.initForm();
    this.formErrors = new FormErrors(this.form);

    this.form.get('state')?.valueChanges.pipe(
      untilDestroyed(this),
      tap(() => this.form.get('roomId')?.reset()),
      switchMap(state => this.roomService.findAllByState(state))
    )
      .subscribe(rooms => {
        if (rooms.length === 0) {
          this.toastrService.info('No hay salas de junta en esta sede','Información');
        }
        this.rooms = rooms;
      });

    this.toastrService.info('Si encuentras algún desperfecto en la sala de juntas, por favor reportarlo en recepción.',
      'Información', { timeOut: 7500 });
  }

  changeTime(field: string, value: Date): void {
    this.form.get(field)?.setValue(roundedTime(value));

    const startTime = this.form.get('startTime')?.value;
    const endTime = this.form.get('endTime')?.value;

    if (!startTime || !endTime) {
      return;
    }

    if(compareTimes(startTime, endTime)) {
      this.form.get('endTime')?.setErrors({isEndTimeBeforeToStartTime: true});
    } else {
      removeError(this.form.get('endTime'), 'isEndTimeBeforeToStartTime');
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();

    const requestRoom:RequestRoomModel = <RequestRoomModel> {
      roomId: formValues.roomId,
      externalPeople: formValues.externalPeople,
      levelId: formValues.levelId
    };

    const request: RequestModel = <RequestModel> {
      title: formValues.title,
      startDate: `${getDateFormat(formValues.date)} ${getTimeFormat(formValues.startTime)}`,
      endDate: `${getDateFormat(formValues.date)} ${getTimeFormat(formValues.endTime)}`,
      people: formValues.people,
      addGoogleCalendar: formValues.addGoogleCalendar,
      comment: formValues.comment,
      // requestPhoneNumber: this.phoneRequestTableComponent.phoneNumbers,
      requestPhoneNumber: [],
      requestEmail: this.emailRequestTableComponent.emails,
      requestRoom
    };

    this.requestRoomService.store(request).subscribe(() => {
      this.form.reset({
        externalPeople: 0,
        addGoogleCalendar: false
      }, { emitEvent: false });

      this.renderTimepicker = true;
      setTimeout(() => {
        this.renderTimepicker = false;
      }, 1);

      this.rooms = [];
      // this.phoneRequestTableComponent.clearData();
      this.emailRequestTableComponent.clearData();

      this.toastrService.success('Solicitud creada', 'Proceso existoso');
    });
  }

  private initForm(): FormGroup {
    return this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      state: [null, Validators.required],
      roomId: [null, Validators.required],
      date: [null, [Validators.required, dateBeforeNow, dateAfter30Days]],
      startTime: [null, [Validators.required, workingHours]],
      endTime: [null, [Validators.required, workingHours]],
      people: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      externalPeople: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      levelId: [null, [Validators.required]],
      addGoogleCalendar: [false],
      comment: [null, [Validators.minLength(0), Validators.maxLength(2500)]]
    });
  }

  private getStatesAndMeetingTypes(): void {
    forkJoin([
      this.stateService.findAll(),
      this.lookupService.findAllByType(TypeLookup.LEVEL_MEETING)
    ])
      .subscribe(([states, meetingTypes]) => {
        this.states = states;
        this.meetingTypes = meetingTypes;
    });
  }
}
