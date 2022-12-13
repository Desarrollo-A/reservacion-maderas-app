import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { Meta, PaginationResponse } from "../../../../core/interfaces/pagination-response";
import { RequestDriverViewModel } from "../../../../core/models/request-driver-view.model";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { FormControl } from "@angular/forms";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { RequestDriverService } from "../../../../core/services/request-driver.service";
import { RequestService } from "../../../../core/services/request.service";
import { UserSessionService } from "../../../../core/services/user-session.service";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { RequestPackageViewModel } from "../../../../core/models/request-package-view.model";
import { StatusRequestRoomLookup } from "../../../../core/enums/lookups/status-request-room.lookup";
import { NameRole } from "../../../../core/enums/name-role";
import { Sort } from "@angular/material/sort";
import { getSort } from "../../../../shared/utils/http-functions";

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
  requestDriverResponse: PaginationResponse<RequestDriverViewModel>;
  dataSource: MatTableDataSource<RequestDriverViewModel> | null;
  columns: TableColumn<RequestDriverViewModel>[] = [
    { label: 'Clave', property: 'code', type: 'text', visible: true },
    { label: 'Título', property: 'title', type: 'text', visible: true },
    { label: 'Fecha salida', property: 'startDate', type: 'text', visible: true },
    { label: 'Fecha llegada', property: 'endDate', type: 'text', visible: true },
    { label: 'Solicitante', property: 'fullName', type: 'text', visible: false },
    { label: 'Lugar salida', property: 'statePickup', type: 'text', visible: true },
    { label: 'Lugar llegada', property: 'stateArrival', type: 'text', visible: true },
    { label: 'Estatus', property: 'statusName', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true },
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-request_id';
  searchCtrl = new FormControl('');
  filters: Filters = { filters: [] };

  constructor(private requestDriverService: RequestDriverService,
              private requestService: RequestService,
              private userSessionService: UserSessionService,
              private dialog: MatDialog,
              private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<RequestDriverViewModel>();
    this.prepareFilters();
  }

  get visibleColumns(): string[] {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  canDeleteRequest(request: RequestPackageViewModel): boolean {
    return (request.statusCode === StatusRequestRoomLookup[StatusRequestRoomLookup.NEW] &&
      this.userSessionService.user.role.name === NameRole.APPLICANT);
  }

  sortChange(sortState: Sort): void {
    const sort = getSort(sortState);
    this.orderBy = (sort === '') ? '-request_id' : sort;
    this.prepareFilters();
  }

  paginatorChanges(meta: Meta): void {
    this.requestDriverResponse.meta = meta;
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

  deleteRequest(id: number): void {
    //
  }

  trackById(index: number, item: RequestDriverViewModel) {
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
    this.generateFilter('status_name', TypesEnum.String, filter);
    this.generateFilter('state_pickup', TypesEnum.String, filter);
    this.generateFilter('state_arrival', TypesEnum.String, filter);

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.requestDriverResponse?.meta) {
      const { currentPage, perPage } = this.requestDriverResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }

    this.requestDriverService.findAllPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery)
      .subscribe(requestDriverResponse => {
        this.requestDriverResponse = requestDriverResponse;
        this.dataSource.data = requestDriverResponse.data;
      });
  }

  private clearFilters(): void {
    this.filters = { filters: [] };
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }
}
