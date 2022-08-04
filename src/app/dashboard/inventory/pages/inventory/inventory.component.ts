import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy } from '@ngneat/until-destroy';
import { InventoryModel } from 'src/app/dashboard/inventory/models/inventory.model';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { stagger40ms } from 'src/app/shared/animations/stagger.animation';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';
import { Meta, PaginationResponse } from "../../../../core/interfaces/pagination-response";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { MatDialog } from "@angular/material/dialog";
import { InventoryService } from "../../services/inventory.service";
import { Sort } from "@angular/material/sort";
import { getSort } from "../../../../shared/utils/http-functions";

@UntilDestroy()
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})

export class InventoryComponent implements OnInit {
  inventoryResponse: PaginationResponse<InventoryModel>;
  dataSource: MatTableDataSource<InventoryModel> | null;
  columns: TableColumn<InventoryModel>[] = [
    {label: 'Nombre', property: 'name', type: 'text', visible: true},
    {label: 'Descripción', property: 'description', type: 'text', visible: true},
    {label: 'Stock', property: 'stock', type: 'text', visible: true},
    {label: 'Estatus', property: 'status', visible: true},
    {label: 'Tipo Inventario', property: 'typeInventory', visible: true},
    {label: 'Unidad', property: 'unit', visible: true},
    {label: 'Acciones', property: 'actions', visible: true}
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '';
  searchCtrl = new FormControl('');
  filters: Filters = {filters: []};

  constructor(private dialog: MatDialog,
              private inventoryService: InventoryService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<InventoryModel>();
    this.prepareFilters();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  sortChange(sortState: Sort): void {
    this.orderBy = getSort(sortState);
    this.prepareFilters();
  }

  paginatorChanges(meta: Meta): void {
    this.inventoryResponse.meta = meta;
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

  private prepareFilters(): void {
    this.clearFilters();
    const filter = this.searchCtrl.value;

    if (filter === '') {
      return this.getData();
    }

    this.generateFilter('name', TypesEnum.String, filter);
    this.generateFilter('description', TypesEnum.String, filter);
    this.generateFilter('lookup', TypesEnum.String, filter);
    if (!isNaN(Number(filter))) {
      this.generateFilter('stock', TypesEnum.Int, Number(filter));
    }

    if (this.inventoryResponse?.meta) {
      this.inventoryResponse.meta.currentPage = 1;
    }

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.inventoryResponse?.meta) {
      const { currentPage, perPage } = this.inventoryResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }

    this.inventoryService.findAllPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery)
      .subscribe(inventoryResponse => {
        this.inventoryResponse = inventoryResponse;
        this.dataSource.data = inventoryResponse.data;
      });
  }

  private clearFilters(): void {
    this.filters = { filters: [] };
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }
}
