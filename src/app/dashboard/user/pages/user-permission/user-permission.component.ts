import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { Meta, PaginationResponse } from "../../../../core/interfaces/pagination-response";
import { UserModel } from "../../../../core/models/user.model";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { FormControl } from "@angular/forms";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { trackById } from "../../../../shared/utils/track-by";
import { UserService } from "../../../../core/services/user.service";
import { Sort } from "@angular/material/sort";
import { getSort } from "../../../../shared/utils/http-functions";
import { MatDialog } from "@angular/material/dialog";
import { NavigationService } from "../../../../core/services/navigation.service";
import { AssignPermisionComponent } from "../../components/assign-permision/assign-permision.component";

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styles: [],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class UserPermissionComponent implements OnInit {
  userResponse: PaginationResponse<UserModel>;
  dataSource: MatTableDataSource<UserModel> | null;
  columns: TableColumn<UserModel>[] = [
    {label: 'N° de colaborador', property: 'noEmployee', type: 'text', visible: true},
    {label: 'Nombre completo', property: 'fullName', type: 'text', visible: true},
    {label: 'Correo', property: 'email', type: 'text', visible: true},
    {label: 'Teléfono', property: 'personalPhone', type: 'text', visible: true},
    {label: 'Puesto', property: 'position', type: 'text', visible: false},
    {label: 'Área', property: 'area', type: 'text', visible: false},
    {label: 'Acciones', property: 'actions', type: 'button', visible: true}
  ];
  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '-id';
  searchCtrl = new FormControl('');
  filters: Filters = {filters: []};
  trackById = trackById;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private navigationService: NavigationService
  ) { }

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

  openDialog(userId: number): void {
    this.navigationService.getNavigationByUserId(userId).subscribe(navigation => {
      this.dialog.open(AssignPermisionComponent, {
        data: navigation,
        autoFocus: false
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

    this.userService.findAllUserPermissionPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery)
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
