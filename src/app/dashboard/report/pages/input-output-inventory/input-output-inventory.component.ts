import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { Meta, PaginationResponse } from "../../../../core/interfaces/pagination-response";
import { InputOutputInventoryModel } from "../../../../core/models/input-output-inventory.model";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { FormControl } from "@angular/forms";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { ReportService } from "../../../../core/services/report.service";
import { Sort } from "@angular/material/sort";
import { getSort } from "../../../../shared/utils/http-functions";
import { MatDialog } from "@angular/material/dialog";
import {
  InputOutputInventoryConfigComponent
} from "../../components/input-output-inventory-config/input-output-inventory-config.component";

@Component({
  selector: 'app-input-output-inventory',
  templateUrl: './input-output-inventory.component.html',
  styleUrls: ['./input-output-inventory.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class InputOutputInventoryComponent implements OnInit {
  dataResponse: PaginationResponse<InputOutputInventoryModel>;
  dataSource: MatTableDataSource<InputOutputInventoryModel> | null;
  columns: TableColumn<InputOutputInventoryModel>[] = [
    { label: 'Clave', property: 'code', visible: true },
    { label: 'Nombre', property: 'name', visible: true },
    { label: 'Cantidad', property: 'quantity', visible: true },
    { label: 'Costo', property: 'cost', visible: true },
    { label: 'Tipo', property: 'type', visible: true },
    { label: 'Fecha de movimiento', property: 'moveDate', visible: true }
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-move_date';
  searchCtrl = new FormControl('');
  filters: Filters = { filters: [] };

  constructor(private reportService: ReportService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<InputOutputInventoryModel>();
    this.prepareFilters();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  configReport(): void {
    this.dialog.open(InputOutputInventoryConfigComponent, {
      autoFocus: false
    });
  }

  sortChange(sortState: Sort): void {
    const sort = getSort(sortState);
    this.orderBy = (sort.length === 0) ? '-move_date' : sort;
    this.prepareFilters();
  }

  paginatorChanges(meta: Meta): void {
    this.dataResponse.meta = meta;
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
    this.generateFilter('type', TypesEnum.String, filter);

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.dataResponse?.meta) {
      const { currentPage, perPage } = this.dataResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }

    this.reportService.findAllPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery).subscribe(dataResponse => {
      this.dataResponse = dataResponse;
      this.dataSource.data = dataResponse.data;
    });
  }

  private clearFilters(): void {
    this.filters = { filters: [] };
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }
}
