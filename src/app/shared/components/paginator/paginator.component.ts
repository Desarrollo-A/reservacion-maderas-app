import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Meta } from "../../../core/interfaces/pagination-response";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styles: ['']
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
