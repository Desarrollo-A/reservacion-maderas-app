import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { stagger40ms } from "../../../../animations/stagger.animation";
import { fadeInUp400ms } from "../../../../animations/fade-in-up.animation";
import { RequestEmailModel } from "../../../../../core/models/request-email.model";
import { Lookup } from "../../../../../core/interfaces/lookup";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import { TableColumn } from "../../../../interfaces/table-column.interface";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { UserSessionService } from "../../../../../core/services/user-session.service";
import { RequestEmailService } from "../../../../../core/services/request-email.service";
import { NameRole } from "../../../../../core/enums/name-role";
import { StatusRequestRoomLookup } from "../../../../../core/enums/lookups/status-request-room.lookup";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { EmailCreateUpdateComponent } from "../email-create-update/email-create-update.component";
import { DeleteConfirmComponent } from "../../../delete-confirm/delete-confirm.component";

@UntilDestroy()
@Component({
  selector: 'app-email-request-table',
  templateUrl: './email-request-table.component.html',
  styleUrls: ['./email-request-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})
export class EmailRequestTableComponent implements OnInit, AfterViewInit {
  @Input()
  emails: RequestEmailModel[] = [];
  @Input()
  previousStatus: Lookup;
  @Input()
  requestId: number;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  dataSource: MatTableDataSource<RequestEmailModel> | null;
  searchCtrl = new FormControl();
  columns: TableColumn<RequestEmailModel>[] = [
    { label: 'Nombre', property: 'name', visible: true },
    { label: 'Correo electrónico', property: 'email', visible: true }
  ];

  constructor(private dialog: MatDialog,
              private toastrService: ToastrService,
              private userSessionService: UserSessionService,
              private requestEmailService: RequestEmailService) { }

  ngOnInit(): void {
    if (!this.previousStatus || (!this.isRecepcionist && this.canDoActions)) {
      this.columns.push({ label: 'Acciones', property: 'actions', visible: true });
    }

    this.dataSource = new MatTableDataSource<RequestEmailModel>(this.emails);

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  get isRecepcionist(): boolean {
    return this.userSessionService.user?.role?.name === NameRole.RECEPCIONIST;
  }

  get canDoActions(): boolean {
    return (this.previousStatus && this.previousStatus?.code === StatusRequestRoomLookup[StatusRequestRoomLookup.NEW]);
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  openDialog(requestEmail?: RequestEmailModel): void {
    if (!requestEmail) {
      this.dialog.open(EmailCreateUpdateComponent, {
        data: null,
        width: '350px'
      }).afterClosed().subscribe((result?: RequestEmailModel) => {
        if (result) {
          this.saveEmail(result);
        }
      });
    } else {
      this.dialog.open(EmailCreateUpdateComponent, {
        data: {... requestEmail},
        width: '350px'
      }).afterClosed().subscribe((result?: RequestEmailModel) => {
        if (result) {
          const i = this.emails.findIndex(email => email.email === requestEmail.email);
          this.emails.splice(i, 1);
          this.updateEmail(result, i);
        }
      });
    }
  }

  openDialogDelete(email: RequestEmailModel): void {
    this.dialog.open(DeleteConfirmComponent, { autoFocus: false }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.deleteEmail(email);
        }
      });
  }

  clearData(): void {
    this.emails = [];
    this.dataSource.data = this.emails;
    this.searchCtrl.setValue('');
  }

  private saveEmail(email: RequestEmailModel): void {
    if (!this.previousStatus) {
      this.emails.push(email);
      this.dataSource.data = this.emails;
      this.toastrService.success('Contacto agregado', 'Proceso exitoso');
    } else {
      email.requestId = this.requestId;
      this.requestEmailService.store(email).subscribe(result => {
        this.emails.push(result);
        this.dataSource.data = this.emails;
        this.toastrService.success('Contacto agregado', 'Proceso exitoso');
      });
    }
  }

  private updateEmail(email: RequestEmailModel, index: number): void {
    if (!email.id) {
      this.emails.splice(index, 0, email);
      this.dataSource.data = this.emails;
      this.toastrService.success('Contacto actualizado', 'Proceso exitoso');
    } else {
      this.requestEmailService.update(email.id, email).subscribe(result => {
        this.emails.splice(index, 0, result);
        this.dataSource.data = this.emails;
        this.toastrService.success('Contacto actualizado', 'Proceso exitoso');
      });
    }
  }

  private deleteEmail(email: RequestEmailModel): void {
    if (!email.id) {
      const i = this.emails.findIndex(data => data.email === email.email);
      this.emails.splice(i, 1);
      this.dataSource.data = this.emails;
      this.toastrService.success('Contacto eliminado', 'Proceso exitoso');
    } else {
      this.requestEmailService.delete(email.id).subscribe(() => {
        const i = this.emails.findIndex(data => data.email === email.email);
        this.emails.splice(i, 1);
        this.dataSource.data = this.emails;
        this.toastrService.success('Contacto eliminado', 'Proceso exitoso');
      });
    }
  }

  private onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }
}
