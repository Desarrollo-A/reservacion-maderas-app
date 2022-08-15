import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { NameRol } from 'src/app/core/enums/name-rol';
import { Lookup } from 'src/app/core/interfaces/lookup';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { stagger40ms } from 'src/app/shared/animations/stagger.animation';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
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
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator,{ static:true })
paginator:MatPaginator;
@ViewChild(MatSort, {static:true})
sort: MatSort;

  users: UserModel[];
  columns: TableColumn<UserModel>[] = [
    {label: 'N° de empleado', property:  'noEmployee', type: 'text', visible: true,},
    {label: 'Nombre completo', property:  'fullName', type: 'text', visible: true,},
    {label: 'Correo', property:  'email', type: 'text', visible: true,},
    {label: 'Teléfono', property:  'personalPhone', type: 'text', visible: true,},
    {label: 'Puesto', property:  'position', type: 'text', visible: true,},
    {label: 'Área', property:  'area', type: 'text', visible: true,},
    {label: 'Estatus', property: 'status', type: 'button', visible: true },
    {label: 'Rol', property:  'role', type: 'button', visible: true,}
    ];

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<UserModel> | null;
  searchCtrl = new UntypedFormControl();

  constructor() { }


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.getData().subscribe(users => {
      this.users = users;
      this.dataSource.data = users;
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
  private getData(): Observable<UserModel[]> {
    return of<UserModel[]>([
      {  noEmployee: 'FRO0154', fullName: 'Juan Ramon Lopez Montolla', email: 'ramon@ciudadmaderas.com', personalPhone: '4421564869', position: 'Gerente', area: 'Control interno',  status: <Lookup>{name: 'Activo'}, role: <Lookup>{name: NameRol.APPLICANT} },
      {  noEmployee: 'CIB0164', fullName: 'Norma Urtado Torres', email: 'norma@ciudadmaderas.com', personalPhone: '4426978145', position: 'Recepcionista', area: 'Compras',  status: <Lookup>{name: 'Activo'}, role: <Lookup>{name: NameRol.RECEPCIONIST} },
      {  noEmployee: 'PHC4165', fullName: 'Edgar Tenorio Solis', email: 'edgar@ciudadmaderas.com', personalPhone: '4420136548', position: 'Administrativo', area: 'Capital humano',  status: <Lookup>{name: 'Inactivo'}, role: <Lookup>{name: NameRol.APPLICANT} },
      {  noEmployee: 'CIN074', fullName: 'Joaquin Lopez Tarzo', email: 'lopez@ciudadmaderas.com', personalPhone: '4426874159', position: 'Contador', area: 'Cuentas por pagar',  status: <Lookup>{name: 'Bloqueado'}, role: <Lookup>{name: NameRol.APPLICANT} },
      {  noEmployee: 'FRO467', fullName: 'Sofia Juárez Gómez', email: 'robert@ciudadmaderas.com', personalPhone: '4424710364', position: 'Recepcionista', area: 'Nóminas',  status: <Lookup>{name: 'Activo'}, role: <Lookup>{name: NameRol.RECEPCIONIST} },
    ].map(user => new UserModel(user)));
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
