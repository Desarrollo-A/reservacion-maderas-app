import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Meta } from "../../../core/interfaces/pagination-response";
import { PageEvent } from "@angular/material/paginator";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from "@angular/material/form-field";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styles: [''],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class PaginatorComponent {
  @Input()
  pageSizeOptions: number[];
  @Input()
  set meta(meta: Meta) {
    this._meta = meta;
  }

  @Output()
  onChanges: EventEmitter<Meta> = new EventEmitter<Meta>();

  _meta!: Meta;

  public pageChange(pageEvent: PageEvent) {
    let meta = { ...this._meta };

    meta.currentPage = pageEvent.pageIndex + 1;
    meta.perPage = pageEvent.pageSize;

    this.onChanges.emit(meta);
  }
}
