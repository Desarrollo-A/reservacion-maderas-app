import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { Meta, PaginationResponse } from "../../../../core/interfaces/pagination-response";
import { RequestPackageViewModel } from "../../../../core/models/request-package-view.model";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { FormControl } from "@angular/forms";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { RequestPackageService } from "../../../../core/services/request-package.service";
import { Sort } from "@angular/material/sort";
import { getSort } from "../../../../shared/utils/http-functions";

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class PackageListComponent implements OnInit {
  requestPackageResponse: PaginationResponse<RequestPackageViewModel>;
  dataSource: MatTableDataSource<RequestPackageViewModel> | null;
  columns: TableColumn<RequestPackageViewModel>[] = [
    { label: 'Clave', property: 'code', type: 'text', visible: true },
    { label: 'Título', property: 'title', type: 'text', visible: true },
    { label: 'Fecha', property: 'startDate', type: 'text', visible: true },
    { label: 'Solicitante', property: 'fullName', type: 'text', visible: false },
    { label: 'Salida', property: 'statePickup', type: 'text', visible: true },
    { label: 'Llegada', property: 'stateArrival', type: 'text', visible: true },
    { label: 'Estatus', property: 'statusName', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true },
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-request_id';
  searchCtrl = new FormControl('');
  filters: Filters = { filters: [] };

  constructor(
    private requestPackageService: RequestPackageService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<RequestPackageViewModel>();
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
    this.requestPackageResponse.meta = meta;
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

  trackById(index: number, item: RequestPackageViewModel) {
    return item.requestId;
  }

  private prepareFilters(): void {
    this.clearFilters();
    const filter = this.searchCtrl.value;

    if (filter === '') {
      return this.getData();
    }

    this.generateFilter('code', TypesEnum.String, filter);
    this.generateFilter('title', TypesEnum.String, filter);
    this.generateFilter('username', TypesEnum.String, filter);
    this.generateFilter('state_pickup', TypesEnum.String, filter);
    this.generateFilter('state_arrival', TypesEnum.String, filter);

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.requestPackageResponse?.meta) {
      const { currentPage, perPage } = this.requestPackageResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }

    this.requestPackageService.findAllPackagesByManagerIdPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery)
      .subscribe(requestPackageResponse => {
        this.requestPackageResponse = requestPackageResponse;
        this.dataSource.data = requestPackageResponse.data;
      });
  }

  private clearFilters(): void {
    this.filters = { filters: [] };
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }
}
