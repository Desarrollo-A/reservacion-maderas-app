import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from "@angular/material/form-field";

@Component({
  selector: 'app-simple-paginator',
  templateUrl: './simple-paginator.component.html',
  styles: [],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class SimplePaginatorComponent implements AfterViewInit {
  @Input()
  pageSize = 5;
  @Input()
  pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input()
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  constructor() { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
