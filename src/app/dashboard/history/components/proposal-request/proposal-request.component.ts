import { Component, Input, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { weekendsOffCalendar } from "../../../../shared/utils/utils";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { dateBeforeNow } from "../../../../shared/utils/form-validations";
import { AvailableScheduleModel } from "../../models/available-schedule.model";
import { RequestRoomService } from "../../../request/services/request-room.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { switchMap } from "rxjs";

@UntilDestroy()
@Component({
  selector: 'app-proposal-request',
  templateUrl: './proposal-request.component.html',
  styleUrls: ['./proposal-request.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class ProposalRequestComponent implements OnInit {
  @Input()
  requestId: number;

  form: FormGroup;
  formErrors: FormErrors;
  weekendsOff = weekendsOffCalendar;
  availableSchedule: AvailableScheduleModel[] = [];

  constructor(private fb: FormBuilder,
              private requestRoomService: RequestRoomService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [null, [Validators.required, dateBeforeNow]],
      schedule: [null, [Validators.required]]
    });

    this.formErrors = new FormErrors(this.form);

    this.form.get('date')?.valueChanges.pipe(
      untilDestroyed(this),
      switchMap((value: Date) => {
        this.form.get('schedule')?.setValue(null);
        const date = value.toISOString().split('T')[0];
        return this.requestRoomService.getAvailableSchedule(this.requestId, date);
      })
    ).subscribe(availableSchedule => this.availableSchedule = availableSchedule);
  }
}
