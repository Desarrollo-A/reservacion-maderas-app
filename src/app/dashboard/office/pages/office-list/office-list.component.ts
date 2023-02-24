import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from "@ngneat/until-destroy";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { Meta, PaginationResponse } from "../../../../core/interfaces/pagination-response";
import { OfficeModel } from "../../../../core/models/office.model";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { UserModel } from "../../../../core/models/user.model";
import { FormControl } from "@angular/forms";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { trackById } from "../../../../shared/utils/track-by";
import { MatDialog } from "@angular/material/dialog";
import { OfficeService } from "../../../../core/services/office.service";
import { Sort } from "@angular/material/sort";
import { getSort } from "../../../../shared/utils/http-functions";
import { OfficeCreateUpdateComponent } from "../../components/office-create-update/office-create-update.component";
import { DeleteConfirmComponent } from "../../../../shared/components/delete-confirm/delete-confirm.component";
import { of, switchMap } from "rxjs";
import { ToastrService } from "ngx-toastr";

@UntilDestroy()
@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class OfficeListComponent implements OnInit {
  officeResponse: PaginationResponse<OfficeModel>;
  dataSource: MatTableDataSource<OfficeModel> | null;
  columns: TableColumn<UserModel>[] = [
    {label: 'Nombre', property: 'name', type: 'text', visible: true},
    {label: 'Sede', property: 'state', type: 'text', visible: true},
    {label: 'Estatus', property: 'status', type: 'button', visible: true},
    {label: 'Acciones', property: 'actions', type: 'button', visible: true}
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-id';
  searchCtrl = new FormControl('');
  filters: Filters = {filters: []};
  trackById = trackById;

  constructor(
    private dialog: MatDialog,
    private officeService: OfficeService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<OfficeModel>();
    this.prepareFilters();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  sortChange(sortState: Sort): void {
    const sort = getSort(sortState);
    this.orderBy = (sort) ? sort : '-id';
    this.prepareFilters();
  }

  paginatorChanges(meta: Meta): void {
    this.officeResponse.meta = meta;
    this.prepareFilters();
  }

  search(): void {
    this.prepareFilters();
  }

  openDialog(id?: number): void {
    if (!id) {
      this.dialog.open(OfficeCreateUpdateComponent, {
        width: '100%',
        data: null
      }).afterClosed().subscribe(created => {
        if (created) {
          this.prepareFilters();
        }
      });
    } else {
      this.officeService.findById(id).subscribe(office => {
        this.dialog.open(OfficeCreateUpdateComponent, {
          width: '100%',
          data: office
        }).afterClosed().subscribe(updated => {
          if (updated) {
            this.prepareFilters();
          }
        });
      });
    }
  }

  deleteOffice(id: number): void {
    this.dialog.open(DeleteConfirmComponent, { autoFocus: false }).afterClosed().pipe(
      switchMap(confirm => (confirm) ? this.officeService.delete(id) : of(false))
    ).subscribe(confirm => {
      if (confirm) {
        this.toastrService.success('Oficina eliminada', 'Proceso exitoso');
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

    this.generateFilter('name', TypesEnum.String, filter);
    this.generateFilter('state', TypesEnum.String, filter);

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.officeResponse?.meta) {
      const {currentPage, perPage} = this.officeResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }

    this.officeService.findAllPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery)
      .subscribe(officeResponse => {
        this.officeResponse = officeResponse;
        this.dataSource.data = officeResponse.data;
      });
  }

  private clearFilters(): void {
    this.filters = {filters: []};
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({field, type, value});
  }
}
