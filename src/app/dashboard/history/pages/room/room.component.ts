import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { RequestRoomViewModel } from "../../models/request-room-view.model";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { MatTableDataSource } from "@angular/material/table";
import { Meta, PaginationResponse } from "../../../../core/interfaces/pagination-response";
import { FormControl } from "@angular/forms";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { RequestRoomService } from "../../../request/services/request-room.service";
import { Sort } from "@angular/material/sort";
import { getSort } from "../../../../shared/utils/http-functions";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class RoomComponent implements OnInit {
  requestRoomResponse: PaginationResponse<RequestRoomViewModel>;
  dataSource: MatTableDataSource<RequestRoomViewModel> | null;
  columns: TableColumn<RequestRoomViewModel>[] = [
    { label: 'Solicitante', property: 'fullName', type: 'text', visible: true },
    { label: 'Fecha', property: 'startDate', type: 'date', visible: true },
    { label: 'Hora Inicio', property: 'startTime', type: 'date', visible: true },
    { label: 'Hora Fin', property: 'endTime', type: 'date', visible: true },
    { label: 'Sala', property: 'roomName', type: 'text', visible: true },
    { label: 'Tipo Reunión', property: 'levelMeeting', type: 'button', visible: true },
    { label: 'Estatus', property: 'status', type: 'button', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '';
  searchCtrl = new FormControl('');
  filters: Filters = { filters: [] };

  constructor(private requestRoomService: RequestRoomService) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<RequestRoomViewModel>();
    this.prepareFilters();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  sortChange(sortState: Sort): void {
    this.orderBy = getSort(sortState);
    this.prepareFilters();
  }

  paginatorChanges(meta: Meta): void {
    this.requestRoomResponse.meta = meta;
    this.prepareFilters();
  }

  search(): void {
    this.prepareFilters();
  }

  private prepareFilters(): void {
    this.clearFilters();
    const filter = this.searchCtrl.value;

    if (filter === '') {
      return this.getData();
    }

    this.generateFilter('username', TypesEnum.String, filter);
    this.generateFilter('room_name', TypesEnum.String, filter);
    this.generateFilter('level_meeting', TypesEnum.String, filter);
    this.generateFilter('status_name', TypesEnum.String, filter);

    if (this.requestRoomResponse?.meta) {
      this.requestRoomResponse.meta.currentPage = 1;
    }

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.requestRoomResponse?.meta) {
      const { currentPage, perPage } = this.requestRoomResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }

    this.requestRoomService.findAllPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery)
      .subscribe(requestRoomResponse => {
        this.requestRoomResponse = requestRoomResponse;
        this.dataSource.data = requestRoomResponse.data;
      });
  }

  private clearFilters(): void {
    this.filters = { filters: [] };
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }
}
