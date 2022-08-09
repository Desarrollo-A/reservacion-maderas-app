import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { stagger40ms } from 'src/app/shared/animations/stagger.animation';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';
import { CarModel } from '../../model/car-model';
import { Lookup } from 'src/app/core/interfaces/lookup';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Filters, TypesEnum } from 'src/app/core/interfaces/filters';
import { Meta, PaginationResponse } from 'src/app/core/interfaces/pagination-response';
import { MatDialog } from '@angular/material/dialog';
import { CarService } from '../../services/car.service';
import { getSort } from 'src/app/shared/utils/http-functions';
import { ChangeStatusCarComponent } from '../../components/change-status-car/change-status-car.component';

@UntilDestroy()
@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue:{
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ],
})
export class CarComponent implements OnInit {
  carResponse: PaginationResponse<CarModel>;
  dataSource: MatTableDataSource<CarModel> | null;

  columns: TableColumn<CarModel>[] = [
    {label: 'Razón social', property:  'businessName', type: 'text', visible: true,},
    {label: 'Marca', property:  'trademark', type: 'text', visible: true,},
    {label: 'Modelo', property:  'model', type: 'text', visible: true,},
    {label: 'Color', property:  'color', type: 'text', visible: true,},
    {label: 'Licencia', property:  'licensePlate', type: 'text', visible: true,},
    {label: 'Serie', property:  'serie', type: 'text', visible: true,},
    {label: 'T. circulación', property:  'circulationCard', type: 'text', visible: true,},
    {label: 'Estatus', property: 'statusNameLabel', type: 'button', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  pageSizeOptions: number[] = [5, 10, 20, 50];
  orderBy: string = '';
  searchCtrl = new FormControl('');
  filters: Filters = { filters: [] };

  constructor(private carService: CarService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<CarModel>();
    this.prepareFilters();
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  showChangeStatus(id: number): void {
    this.carService.findById(id).subscribe(car => {
      this.dialog.open(ChangeStatusCarComponent, {
        data: car
      }).afterClosed().subscribe(updated => {
        if (updated) {
          this.prepareFilters();
        }
      });
    });
  }
  sortChange(sortState: Sort): void {
    const sort = getSort(sortState);
    this.orderBy = (sort.length === 0) ? '' : sort;
    this.prepareFilters();
  }

  paginatorChanges(meta: Meta): void {
    this.carResponse.meta = meta;
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

    this.generateFilter('business_name', TypesEnum.String, filter);
    this.generateFilter('trademark', TypesEnum.String, filter);
    this.generateFilter('model', TypesEnum.String, filter);
    this.generateFilter('color', TypesEnum.String, filter);
    this.generateFilter('license_plate', TypesEnum.String, filter);
    this.generateFilter('serie', TypesEnum.String, filter);
    this.generateFilter('circulation_card', TypesEnum.String, filter);
    if (!isNaN(Number(filter))) {
      this.generateFilter('people', TypesEnum.Int, Number(filter));
    }

    if (this.carResponse?.meta) {
      this.carResponse.meta.currentPage = 1;
    }

    this.getData();
  }

  private getData(): void {
    const searchQuery = (this.filters.filters.length === 0) ? '' : JSON.stringify(this.filters);
    let currentPageInit = 1;
    let perPageInit = 5;
    if (this.carResponse?.meta) {
      const { currentPage, perPage } = this.carResponse.meta;
      currentPageInit = currentPage;
      perPageInit = perPage;
    }

    this.carService.findAllPaginated(this.orderBy, perPageInit, currentPageInit, searchQuery).subscribe(carResponse => {
      this.carResponse = carResponse;
      this.dataSource.data = carResponse.data;
    });
  }

  private clearFilters(): void {
    this.filters = { filters: [] };
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
}