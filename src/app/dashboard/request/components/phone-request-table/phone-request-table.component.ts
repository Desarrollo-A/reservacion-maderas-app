import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RequestPhoneNumberModel } from "../../../../core/models/request-phone-number.model";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { MatDialog } from "@angular/material/dialog";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { PhoneCreateUpdateComponent } from "../phone-create-update/phone-create-update.component";
import { ToastrService } from "ngx-toastr";
import { DeleteConfirmComponent } from "../../../../shared/components/delete-confirm/delete-confirm.component";

@UntilDestroy()
@Component({
  selector: 'app-phone-request-table',
  templateUrl: './phone-request-table.component.html',
  styleUrls: ['./phone-request-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    stagger40ms,
    fadeInUp400ms
  ]
})
export class PhoneRequestTableComponent implements OnInit, AfterViewInit {
  @Input()
  phoneNumbers: RequestPhoneNumberModel[] = [];

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  dataSource: MatTableDataSource<RequestPhoneNumberModel> | null;
  searchCtrl = new FormControl();
  columns: TableColumn<Request>[] = [
    { label: 'Nombre', property: 'name', visible: true },
    { label: 'Teléfono', property: 'phone', visible: true },
    { label: 'Acciones', property: 'actions', visible: true }
  ];

  constructor(private dialog: MatDialog,
              private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<RequestPhoneNumberModel>(this.phoneNumbers);

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  openDialog(requestPhone?: RequestPhoneNumberModel): void {
    if (!requestPhone) {
      this.dialog.open(PhoneCreateUpdateComponent, {
        data: null,
        width: '350px'
      }).afterClosed().subscribe((result?: RequestPhoneNumberModel) => {
        if (result) {
          this.savePhone(result);
        }
      });
    } else {
      this.dialog.open(PhoneCreateUpdateComponent, {
        data: {... requestPhone},
        width: '350px'
      }).afterClosed().subscribe((result?: RequestPhoneNumberModel) => {
        if (result) {
          const i = this.phoneNumbers.findIndex(phone => phone.phone === requestPhone.phone);
          this.phoneNumbers.splice(i, 1);
          this.updatePhone(result, i);
        }
      });
    }
  }

  openDialogDelete(phone: RequestPhoneNumberModel): void {
    this.dialog.open(DeleteConfirmComponent, { autoFocus: false }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.deletePhone(phone);
        }
      });
  }

  clearData(): void {
    this.phoneNumbers = [];
    this.dataSource.data = this.phoneNumbers;
    this.searchCtrl.setValue('');
  }

  private savePhone(phone: RequestPhoneNumberModel): void {
    if (!phone.id) {
      this.phoneNumbers.push(phone);
      this.dataSource.data = this.phoneNumbers;
      this.toastrService.success('Contacto agregado', 'Proceso exitoso');
    } else {
      //
    }
  }

  private updatePhone(phone: RequestPhoneNumberModel, index: number): void {
    if (!phone.id) {
      this.phoneNumbers.splice(index, 0, phone);
      this.dataSource.data = this.phoneNumbers;
      this.toastrService.success('Contacto actualizado', 'Proceso exitoso');
    } else {
      //
    }
  }

  private deletePhone(phone: RequestPhoneNumberModel): void {
    if (!phone.id) {
      const i = this.phoneNumbers.findIndex(p => p.phone === phone.phone);
      this.phoneNumbers.splice(i, 1);
      this.dataSource.data = this.phoneNumbers;
      this.toastrService.success('Contacto eliminado', 'Proceso exitoso');
    } else {
      //
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
