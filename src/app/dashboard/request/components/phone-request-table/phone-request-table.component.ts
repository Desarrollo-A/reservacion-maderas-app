import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
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

@UntilDestroy()
@Component({
  selector: 'app-phone-request-table',
  templateUrl: './phone-request-table.component.html',
  styleUrls: ['./phone-request-table.component.scss'],
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
      //
    }
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
      this.toastrService.success('Registro agregado', 'Proceso exitoso');
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
