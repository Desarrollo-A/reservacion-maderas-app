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
import { ItemCreateUpdateComponent } from "../../components/item-create-update/item-create-update.component";
import { DeleteConfirmComponent } from "../../../../shared/components/delete-confirm/delete-confirm.component";
import { of, switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { UpdateStockComponent } from "../../components/update-stock/update-stock.component";

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
    {label: 'Nombre', property: 'name', visible: true},
    {label: 'Descripción', property: 'description', visible: true},
    {label: 'Stock', property: 'stock', visible: true},
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
              private inventoryService: InventoryService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<InventoryModel>();
    this.prepareFilters();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  openDialog(id?: number): void {
    if (!id) {
      this.dialog.open(ItemCreateUpdateComponent, {
        width: '100%',
        data: null
      }).afterClosed().subscribe(created => {
        if (created) {
          this.prepareFilters();
        }
      });
    } else {
      this.inventoryService.findById(id).subscribe(inventory => {
        this.dialog.open(ItemCreateUpdateComponent, {
          width: '100%',
          data: inventory
        }).afterClosed().subscribe(updated => {
          if (updated) {
            this.prepareFilters();
          }
        });
      });
    }
  }

  deleteItem(id: number): void {
    this.dialog.open(DeleteConfirmComponent, { autoFocus: false }).afterClosed().pipe(
      switchMap(confirm => (confirm) ? this.inventoryService.delete(id) : of(false))
    ).subscribe(confirm => {
      if (confirm) {
        this.toastrService.success('Item de inventario eliminado', 'Proceso exitoso');
        this.prepareFilters();
      }
    });
  }

  changeStock(id: number): void {
    this.inventoryService.findById(id).subscribe(inventory => {
      this.dialog.open(UpdateStockComponent, { data: inventory }).afterClosed().subscribe(updated => {
        if (updated) {
          this.prepareFilters();
        }
      });
    });
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
