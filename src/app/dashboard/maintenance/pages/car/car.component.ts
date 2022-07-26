import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { stagger40ms } from 'src/app/shared/animations/stagger.animation';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';
import { CarModel } from '../../model/car-model';
import { Lookup } from 'src/app/core/interfaces/lookup';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
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
export class CarComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator,{ static:true })
  paginator:MatPaginator;
  @ViewChild(MatSort, {static:true})
  sort: MatSort;

  cars: CarModel[];
  columns: TableColumn<CarModel>[] = [
    {label: 'Nombre', property:  'businessName', type: 'text', visible: true,},
    {label: 'Marca', property:  'trademark', type: 'text', visible: true,},
    {label: 'Modelo', property:  'model', type: 'text', visible: true,},
    {label: 'Color', property:  'color', type: 'text', visible: true,},
    {label: 'Licencia', property:  'licensePlate', type: 'text', visible: true,},
    {label: 'Serie', property:  'serie', type: 'text', visible: true,},
    {label: 'T. circulación', property:  'circulationCard', type: 'text', visible: true,},
    {label: 'Estatus', property: 'statusNameLabel', type: 'button', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<CarModel> | null;
  searchCtrl = new UntypedFormControl();
  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.getData().subscribe(cars => {
      this.cars = cars;
      this.dataSource.data = cars;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
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

  getData(): Observable<CarModel[]> {
    return of<CarModel[]>([
      {  businessName: 'L200', trademark: 'MITSUBISHI', model: '2018', color: 'Blanco', licensePlate: 'AQG1453', serie: 'DDSDGF34GD345345', circulationCard: 'AQ-A-12646', status: <Lookup>{name: 'Activa'} },
      {  businessName: 'R700', trademark: 'RAM', model: '2019', color: 'Rojo', licensePlate: 'AGE3434', serie: 'GFYHE53HH5634', circulationCard: 'AD-B-23421', status: <Lookup>{name: 'Inactiva'} },
      {  businessName: 'VERSA', trademark: 'NISSAN', model: '2016', color: 'Gris', licensePlate: 'HDEWRSS3', serie: 'JGDF435DFGDG', circulationCard: 'BT-Y-32422', status: <Lookup>{name: 'Mantenimiento'} },
    ].map(car => new CarModel(car)));
  }

  toggleColumnVisibility(column, event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }
}
