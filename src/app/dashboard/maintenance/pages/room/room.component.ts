import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from "rxjs";
import { Lookup } from "../../../../core/interfaces/lookup";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from "@angular/material/form-field";
import { RoomModel } from "../../model/room-model";

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
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class RoomComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  rooms: RoomModel[];
  columns: TableColumn<RoomModel>[] = [
    { label: 'Código', property: 'code', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Nombre', property: 'name', type: 'text', visible: true },
    { label: '# Personas', property: 'noPeople', type: 'text', visible: true },
    { label: 'Estatus', property: 'statusNameLabel', type: 'button', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<RoomModel> | null;

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.getData().subscribe(rooms => {
      this.rooms = rooms;
      this.dataSource.data = rooms;
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

  getData(): Observable<RoomModel[]> {
    return of<RoomModel[]>([
      { id: 1, code: 'SDJ-1', name: 'Salón Carranza', officeId: 1, noPeople: 12, recepcionistId: 1, statusId: 10, status: <Lookup>{name: 'Activa'} },
      { id: 2, code: 'SDJ-2', name: 'Salón Arcos III', officeId: 1, noPeople: 10, recepcionistId: 1, statusId: 10, status: <Lookup>{name: 'Inactiva'} },
      { id: 3, code: 'SDJ-3', name: 'Salón Empire of the Sun', officeId: 1, noPeople: 25, recepcionistId: 1, statusId: 10, status: <Lookup>{name: 'Mantenimiento'} }
    ].map(room => new RoomModel(room)));
  }
}
