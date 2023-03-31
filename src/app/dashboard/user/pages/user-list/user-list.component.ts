import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { stagger40ms } from 'src/app/shared/animations/stagger.animation';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';
import { UserModel } from '../../../../core/models/user.model';
import { Meta, PaginationResponse } from "../../../../core/interfaces/pagination-response";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "../../../../core/services/user.service";
import { getSort } from "../../../../shared/utils/http-functions";
import { trackById } from "../../../../shared/utils/track-by";
import { UpdateUserComponent } from "../../components/update-user/update-user.component";

@UntilDestroy()
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class UserListComponent implements OnInit {
  userResponse: PaginationResponse<UserModel>;
  dataSource: MatTableDataSource<UserModel> | null;
  columns: TableColumn<UserModel>[] = [
    {label: 'N° de empleado', property: 'noEmployee', type: 'text', visible: true},
    {label: 'Nombre completo', property: 'fullName', type: 'text', visible: true},
    {label: 'Correo', property: 'email', type: 'text', visible: true},
    {label: 'Teléfono', property: 'personalPhone', type: 'text', visible: true},
    {label: 'Puesto', property: 'position', type: 'text', visible: false},
    {label: 'Área', property: 'area', type: 'text', visible: false},
    {label: 'Estatus', property: 'status', type: 'button', visible: true},
    {label: 'Rol', property: 'role', type: 'button', visible: true},
    {label: 'Acciones', property: 'actions', type: 'button', visible: true}
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-id';
  searchCtrl = new FormControl('');
  filters: Filters = {filters: []};
  trackById = trackById;

  constructor(
    private dialog: MatDialog,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<UserModel>();
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
    this.userResponse.meta = meta;
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

  updateDialog(id: number): void {
    this.userService.findByid(id).subscribe(user => {
      this.dialog.open(UpdateUserComponent, {
        width: '100%',
        data: user
      }).afterClosed().subscribe(updated => {
        if (updated) {
          this.prepareFilters();
        }
      });
    });
  }

  private prepareFilters(): void {
    this.clearFilters();
    const filter = this.searchCtrl.value;

    if (filter === '') {
      return this.getData();
    }

    this.generateFilter('no_employee', TypesEnum.String, filter);
    this.generateFilter('full_name', TypesEnum.String, filter);
    this.generateFilter('email', TypesEnum.String, filter);
    this.generateFilter('personal_phone', TypesEnum.String, filter);
    this.generateFilter('position', TypesEnum.String, filter);
    this.generateFilter('area', TypesEnum.String, filter);
    this.generateFilter('lookup', TypesEnum.String, filter);
    this.generateFilter('role', TypesEnum.String, filter);

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.userResponse?.meta) {
      const {currentPage, perPage} = this.userResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }

    this.userService.findAllPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery)
      .subscribe(userResponse => {
        this.userResponse = userResponse;
        this.dataSource.data = userResponse.data;
      });
  }

  private clearFilters(): void {
    this.filters = {filters: []};
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({field, type, value});
  }
}
