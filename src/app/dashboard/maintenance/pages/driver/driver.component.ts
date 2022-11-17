import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationResponse } from 'src/app/core/interfaces/pagination-response';
import { DriverModel } from 'src/app/core/models/driver.model';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';
import { FormControl } from "@angular/forms";
import { Filters } from 'src/app/core/interfaces/filters';
import { trackById } from 'src/app/shared/utils/track-by';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {
  driveRespon: PaginationResponse<DriverModel>;
  dataSource: MatTableDataSource<DriverModel> | null;
  colums: TableColumn<DriverModel>[] = [
    {label: 'N° de empleado', property: 'noEmployee', type: 'text', visible: true},
    {label: 'Nombre completo', property: 'fullName', type: 'text', visible: true},
    {label: 'Correo electronico', property: 'email', type: 'text', visible: true},
    {label: 'Telefono personal', property: 'personalPhone', type: 'text', visible: true},
    {label: 'Estatus', property: 'status', type: 'text', visible: true}
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-id';
  searchCtrl = new FormControl('');
  filters: Filters = {filters: []};
  trackById = trackById;
  constructor() { }

  ngOnInit(): void {
  }

}
