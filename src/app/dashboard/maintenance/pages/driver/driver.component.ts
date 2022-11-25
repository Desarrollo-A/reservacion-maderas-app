import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, PaginationResponse } from 'src/app/core/interfaces/pagination-response';
import { DriverModel } from 'src/app/core/models/driver.model';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';
import { FormControl } from "@angular/forms";
import { Filters, TypesEnum } from 'src/app/core/interfaces/filters';
import { trackById } from 'src/app/shared/utils/track-by';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { stagger40ms } from 'src/app/shared/animations/stagger.animation';
import { DriverService } from 'src/app/core/services/driver.service';
import { Sort } from '@angular/material/sort';
import { getSort } from 'src/app/shared/utils/http-functions';
import { RelationCarDriverComponent } from '../../components/relation-car-driver/relation-car-driver.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class DriverComponent implements OnInit {
  driveResponse: PaginationResponse<DriverModel>;
  dataSource: MatTableDataSource<DriverModel> | null;
  colums: TableColumn<DriverModel>[] = [
    {label: 'N° de empleado', property: 'noEmployee', type: 'text', visible: true},
    {label: 'Nombre completo', property: 'fullName', type: 'text', visible: true},
    {label: 'Correo electronico', property: 'email', type: 'text', visible: true},
    {label: 'Telefono personal', property: 'personalPhone', type: 'text', visible: true},
    {label: 'Estatus', property: 'status', type: 'text', visible: true},
    {label: 'Acciones', property: 'actions', visible: true}
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-id';
  searchCtrl = new FormControl('');
  filters: Filters = {filters: []};
  trackById = trackById;

  constructor(private driverService:  DriverService,
              private dialog:         MatDialog) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<DriverModel>;
    this.prepareFilters();
  }

  get visibleColumns(){
    return this.colums.filter(column => column.visible).map(column => column.property);
  }

  openDialog(id: number): void {
    this.driverService.findById(id).subscribe( driver => {
      this.dialog.open(RelationCarDriverComponent, {
        data: driver
      }).afterClosed().subscribe(created => {
        if (created) {
          this.prepareFilters();
        }
      });
    });
  }

  sortChange(sortState: Sort): void{
    const sort = getSort(sortState);
    this.orderBy = (sort.length === 0) ? '-id' : sort;
    this.prepareFilters();
  }

  paginatorChanges(meta: Meta): void{
    this.driveResponse.meta = meta;
    this.prepareFilters();
  }

  search(): void{
    this.prepareFilters();
  }

  private prepareFilters(): void{
    this.clearFilters();
    const filter = this.searchCtrl.value;
    
    if(filter === ''){
      return this.getData();
    }
    
    this.generateFilter('no_employee', TypesEnum.String, filter);
    this.generateFilter('full_name', TypesEnum.String, filter);
    this.generateFilter('email', TypesEnum.String, filter);
    this.generateFilter('personal_phone', TypesEnum.String, filter);

    this.getData();
  }

  private getData(): void{
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let parPageInit = 5;
    if (this.driveResponse?.meta){
      const {currentPage, perPage} = this.driveResponse.meta;
      currentPageInit = currentPage;
      parPageInit = perPage;
    }

    this.driverService.findAllPaginated(this.orderBy, parPageInit, currentPageInit, searchQuery).subscribe(driveResponse => {
      this.driveResponse = driveResponse;
      this.dataSource.data = driveResponse.data;
    });
  }

  private clearFilters(): void {
    this.filters = { filters: [] };
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }

}
