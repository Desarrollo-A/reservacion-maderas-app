import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, PaginationResponse } from 'src/app/core/interfaces/pagination-response';
import { RequestCarViewModel } from 'src/app/core/models/request-car-view.model';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { stagger40ms } from 'src/app/shared/animations/stagger.animation';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';
import { FormControl } from "@angular/forms";
import { Filters, TypesEnum } from 'src/app/core/interfaces/filters';
import { RequestCarService } from 'src/app/core/services/request-car.service';
import { Sort } from '@angular/material/sort';
import { getSort } from 'src/app/shared/utils/http-functions';
import { StatusCarRequestLookup } from "src/app/core/enums/lookups/status-car-request.lookup";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmComponent } from 'src/app/shared/components/delete-confirm/delete-confirm.component';
import { of, switchMap } from 'rxjs';
import { UserSessionService } from 'src/app/core/services/user-session.service';
import { NameRole } from 'src/app/core/enums/name-role';

@Component({
  selector: 'app-car',
  templateUrl: './car-component.html',
  styleUrls: ['./car-component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class CarComponent implements OnInit {

  requestCarResponse: PaginationResponse<RequestCarViewModel>;
  dataSource: MatTableDataSource<RequestCarViewModel> | null;
  columns: TableColumn<RequestCarViewModel>[] = [
    {label: 'Clave',          property: 'code',       type: 'text', visible: true},
    {label: 'Título',         property: 'title',      type: 'text', visible: true},
    {label: 'Solicitante',    property: 'fullName',     type: 'text', visible: false},
    {label: 'Fecha salida',   property: 'startDate',  type: 'date', visible: true},
    {label: 'Fecha llegada',  property: 'endDate',    type: 'date', visible: true},
    {label: 'Estatus',        property: 'statusName',  type: 'text', visible: true},
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-request_id';
  searchCtrl = new FormControl('');
  filters: Filters = {filters: []};
  
  constructor(private requestCarService: RequestCarService,
              private toastrService: ToastrService,
              private dialog: MatDialog,
              private userSessionService: UserSessionService) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<RequestCarViewModel>();
    this.prepareFilters();
  }

  get visibleColumns(): string[] {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  sortChange(sortState: Sort): void {
    const sort = getSort(sortState);
    this.orderBy = (sort === '') ? '-request_id' : sort;
    this.prepareFilters();
  }

  paginatorChanges(meta: Meta): void {
    this.requestCarResponse.meta = meta;
    this.prepareFilters();
  }

  search(): void {
    this.prepareFilters();
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  trackById(index: number, item: RequestCarViewModel) {
    return item.requestId;
  }

  canDeleteRequestCar(requestCar: RequestCarViewModel): boolean{
    return (requestCar.statusCode === StatusCarRequestLookup[StatusCarRequestLookup.NEW] &&
      this.userSessionService.user.role.name === NameRole.APPLICANT);
  }

  deleteRequestCar(requestId: number): void{
    this.dialog.open(DeleteConfirmComponent,{autoFocus: false}).afterClosed().pipe(
      switchMap(confirm => (confirm) ? this.requestCarService.deleteRequestCar(requestId) : of(false))
    ).subscribe(confirmDeleteRequest =>{
        if(confirmDeleteRequest){
          this.toastrService.success('Solicitud eliminada', 'Proceso exitoso');
          this.prepareFilters();
        }
    });
  }

  private prepareFilters(): void {
    this.clearFilters();
    const filter = this.searchCtrl.value;
    if (filter === '') {
      return this.getData();
    }
    this.generateFilter('code', TypesEnum.String, filter);
    this.generateFilter('title', TypesEnum.String, filter);
    this.generateFilter('status_name', TypesEnum.String, filter);
    this.generateFilter('full_name', TypesEnum.String, filter);

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.requestCarResponse?.meta) {
      const { currentPage, perPage } = this.requestCarResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }
    this.requestCarService.findAllPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery)
      .subscribe(requestCarResponse => {
        this.requestCarResponse = requestCarResponse;
        this.dataSource.data = requestCarResponse.data;
      });
  }

  private clearFilters(): void {
    this.filters = { filters: [] };
  }
  
  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }
}
