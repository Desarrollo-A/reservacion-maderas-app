import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { addHours, startOfDay } from 'date-fns';
import { Observable, of } from 'rxjs';
import { Lookup } from 'src/app/core/interfaces/lookup';
import { DriverModel } from 'src/app/dashboard/maintenance/model/driver-model';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { stagger40ms } from 'src/app/shared/animations/stagger.animation';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
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

export class DriverComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator,{static: true})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static:true})
  sort: MatSort;

  drivers: DriverModel[];
  columns: TableColumn<DriverModel>[] = [
    {label:'Nombre conductor',property: 'fullName', type: 'text', visible: true},
    {label:'Fecha solicitada',property: 'date', type: 'date', visible: true},
    {label:'Disponibilidad',property: 'availability', type: 'button', visible: true},
    {label:'Solicitante',property: 'nameApplicant', type: 'text', visible: true},
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }

  ];

  pageSize = 10;
pageSizeOptions: number[] = [5, 10, 20, 50];
dataSource: MatTableDataSource<DriverModel> | null;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.getData().subscribe(drivers => {
      this.drivers = drivers;
      this.dataSource.data = drivers;
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
  toggleColumnVisibility(column, event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  getData(): Observable<DriverModel[]> {
    return of<DriverModel[]>([
      {fullName:'Ramon Torres Gonzalez', date:addHours(startOfDay(new Date()), 8), nameApplicant: 'Juan Gonzalez Rendon', availability: <Lookup>{name: 'Disponible'}  },
      {fullName:'Pedro Perez León', date:addHours(startOfDay(new Date()), 8), nameApplicant: 'Roberto Carlos Azul', availability: <Lookup>{name: 'Disponible'}  },
      {fullName:'Pablo Perez León', date:addHours(startOfDay(new Date()), 8), nameApplicant: 'Juan Gonzalez Rendon', availability: <Lookup>{name: 'Reservado'}  },
      {fullName:'German Rodríguez Paes', date:addHours(startOfDay(new Date()), 8), nameApplicant: 'José María Napoleón', availability: <Lookup>{name: 'Disponible'}  },
      {fullName:'Edgar Teran Estrada', date:addHours(startOfDay(new Date()), 8), nameApplicant: 'Marco Antonio Solis', availability: <Lookup>{name: 'Reservado'}  },

    ].map(drivers => new DriverModel(drivers)));
  }

}
