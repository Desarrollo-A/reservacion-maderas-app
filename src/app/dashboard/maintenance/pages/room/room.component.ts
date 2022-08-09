import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { MatTableDataSource } from "@angular/material/table";
import { RoomModel } from "../../model/room.model";
import { Meta, PaginationResponse } from "../../../../core/interfaces/pagination-response";
import { RoomService } from "../../services/room.service";
import { FormControl } from "@angular/forms";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { Sort } from "@angular/material/sort";
import { getSort } from "../../../../shared/utils/http-functions";
import { MatDialog } from "@angular/material/dialog";
import { ChangeStatusRoomComponent } from "../../components/change-status-room/change-status-room.component";

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
  roomResponse: PaginationResponse<RoomModel>;
  dataSource: MatTableDataSource<RoomModel> | null;
  columns: TableColumn<RoomModel>[] = [
    { label: 'Código', property: 'code', type: 'text', visible: true, cssClasses: ['text-secondary', 'font-medium'] },
    { label: 'Nombre', property: 'name', type: 'text', visible: true },
    { label: '# Personas', property: 'noPeople', type: 'text', visible: true },
    { label: 'Estatus', property: 'statusLabel', visible: true },
    { label: 'Acciones', property: 'actions', visible: true }
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-code';
  searchCtrl = new FormControl('');
  filters: Filters = { filters: [] };

  constructor(private roomService: RoomService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<RoomModel>();
    this.prepareFilters();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  showChangeStatus(id: number): void {
    this.roomService.findById(id).subscribe(room => {
      this.dialog.open(ChangeStatusRoomComponent, {
        data: room
      }).afterClosed().subscribe(updated => {
        if (updated) {
          this.prepareFilters();
        }
      });
    });
  }

  sortChange(sortState: Sort): void {
    const sort = getSort(sortState);
    this.orderBy = (sort.length === 0) ? '-code' : sort;
    this.prepareFilters();
  }

  paginatorChanges(meta: Meta): void {
    this.roomResponse.meta = meta;
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

    this.generateFilter('code', TypesEnum.String, filter);
    this.generateFilter('name', TypesEnum.String, filter);
    if (!isNaN(Number(filter))) {
      this.generateFilter('no_people', TypesEnum.Int, Number(filter));
    }

    if (this.roomResponse?.meta) {
      this.roomResponse.meta.currentPage = 1;
    }

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.roomResponse?.meta) {
      const { currentPage, perPage } = this.roomResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }

    this.roomService.findAllPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery).subscribe(roomResponse => {
      this.roomResponse = roomResponse;
      this.dataSource.data = roomResponse.data;
    });
  }

  private clearFilters(): void {
    this.filters = { filters: [] };
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }
}
