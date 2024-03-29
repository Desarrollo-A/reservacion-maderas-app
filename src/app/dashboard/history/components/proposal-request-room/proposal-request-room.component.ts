import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { getDateFormat, weekendsOffCalendar } from "../../../../shared/utils/utils";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { dateBeforeNow } from "../../../../shared/utils/form-validations";
import { AvailableScheduleModel } from "../../../../core/models/available-schedule.model";
import { RequestRoomService } from "../../../../core/services/request-room.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { of, switchMap } from "rxjs";
import { ProposalRequestModel } from "../../../../core/models/proposal-request.model";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmProposalComponent } from "../confirm-proposal/confirm-proposal.component";
import { UserSessionService } from "../../../../core/services/user-session.service";

@UntilDestroy()
@Component({
  selector: 'app-proposal-request-room',
  templateUrl: './proposal-request-room.component.html',
  styleUrls: ['./proposal-request-room.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class ProposalRequestRoomComponent implements OnInit {
  @Input()
  requestId: number;
  @Input()
  proposalData: ProposalRequestModel[] = [];

  @Output()
  chosenProposal: EventEmitter<ProposalRequestModel> = new EventEmitter<ProposalRequestModel>();


  private _dataSource = new MatTableDataSource<ProposalRequestModel>();

  form: FormGroup;
  formErrors: FormErrors;
  weekendsOff = weekendsOffCalendar;
  availableScheduleDate1: AvailableScheduleModel[] = [];
  availableScheduleDate2: AvailableScheduleModel[] = [];
  columns: TableColumn<ProposalRequestModel>[] = [
    {label: 'Número', property: 'number', type: 'text', visible: true},
    {label: 'Fecha', property: 'date', type: 'text', visible: true},
    {label: 'Hora inicio', property: 'startTime', type: 'text', visible: true},
    {label: 'Hora fin', property: 'endTime', type: 'text', visible: true}
  ];

  constructor(private fb: FormBuilder,
              private requestRoomService: RequestRoomService,
              private toastrService: ToastrService,
              private dialog: MatDialog,
              private userSessionService: UserSessionService) {}

  ngOnInit(): void {
    if (this.isApplicant) {
      this.columns.push({label: 'Acción', property: 'action', type: 'button', visible: true});
    }

    this.form = this.fb.group({
      date1: [null, [Validators.required, dateBeforeNow]],
      schedule1: [null, [Validators.required]],
      date2: [{value: null, disabled: true}, [Validators.required, dateBeforeNow]],
      schedule2: [{value: null, disabled: true}, [Validators.required]]
    });

    this.formErrors = new FormErrors(this.form);

    this.form.get('date1')?.valueChanges.pipe(
      untilDestroyed(this),
      switchMap((value: Date) => {
        this.form.get('schedule1')?.setValue(null);
        if (this.form.get('date2')?.value?.getTime() === value.getTime()) {
          this.availableScheduleDate2 = [... this.availableScheduleDate1];
          this.form.get('schedule2')?.setValue(null);
        }

        return this.requestRoomService.getAvailableSchedule(this.requestId, getDateFormat(value));
      })
    ).subscribe(availableSchedule => this.availableScheduleDate1 = availableSchedule);

    this.form.get('schedule1')?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => {
      if (value !== null && this.form.get('date2')?.disabled && this.form.get('schedule2')?.disabled) {
        this.form.get('date2')?.enable();
        this.form.get('schedule2')?.enable();
      }
    });

    this.form.get('date2')?.valueChanges.pipe(
      untilDestroyed(this),
      switchMap((value: Date) => {
        if (!value) {
          return of([]);
        }

        this.form.get('schedule2')?.setValue(null);
        let scheduleDate2 = [];
        if (this.form.get('date1')?.value.getTime() === value.getTime()) {
          scheduleDate2 = scheduleDate2
            .concat(this.availableScheduleDate1.slice(0, this.form.get('schedule1')?.value))
            .concat(this.availableScheduleDate1.slice(this.form.get('schedule1')?.value+1));
        }

        return (scheduleDate2.length === 0)
          ? this.requestRoomService.getAvailableSchedule(this.requestId, getDateFormat(value))
          : of(scheduleDate2)
      })
    ).subscribe(availableSchedule => this.availableScheduleDate2 = availableSchedule);

    if (this.proposalData.length > 0 && this.isApplicant) {
      this.toastrService.info('Puedes aceptar una propuesta o rechazar la solicitud.', 'Información');
    }
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  get dataSource(): MatTableDataSource<ProposalRequestModel> {
    this._dataSource.data = this.proposalData;
    return this._dataSource;
  }

  get isApplicant(): boolean {
    return this.userSessionService.isApplicant;
  }

  confirmationProposal(id: number, index: number): void {
    this.dialog.open(ConfirmProposalComponent, {data: index+1, autoFocus: false})
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.chosenProposal.emit(this.proposalData.find(proposal => proposal.id === id));
        }
      });
  }
}
