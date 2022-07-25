import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from "@angular/material/form-field";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { RequestRoomModel } from "../../models/request-room.model";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, of } from "rxjs";
import { addHours, startOfDay } from "date-fns";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue:{
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ],
})
export class RoomComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator,{ static:true })
  paginator:MatPaginator;
  @ViewChild(MatSort, {static:true})
  sort: MatSort;

  requests: RequestRoomModel[];
  columns: TableColumn<RequestRoomModel>[] = [
    { label: 'Solicitante', property: 'user', type: 'text', visible: true },
    { label: 'Fecha Inicio', property: 'startDate', type: 'date', visible: true },
    { label: 'Fecha Fin', property: 'endDate', type: 'date', visible: true },
    { label: 'Sala', property: 'room', type: 'text', visible: true },
    { label: 'Estatus', property: 'labelStatus', type: 'button', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<RequestRoomModel> | null;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.getData().subscribe(requests => {
      this.requests = requests;
      this.dataSource.data = requests;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  getData(): Observable<RequestRoomModel[]> {
    return of<RequestRoomModel[]>([
      { id: 1, startDate: addHours(startOfDay(new Date()), 8), endDate: addHours(startOfDay(new Date()), 9), room: 'Sala Carranza', user: 'Fabiola Madrid Cortés', status: 'Disponible' },
      { id: 2, startDate: addHours(startOfDay(new Date()), 10), endDate: addHours(startOfDay(new Date()), 11), room: 'Sala Carranza', user: 'David Mendoza Pérez', status: 'Ocupada' }
    ].map(requestRoomModel => new RequestRoomModel(requestRoomModel)));
  }
}
