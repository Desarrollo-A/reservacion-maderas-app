import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../interfaces/table-column.interface";
import { fadeInUp400ms } from "../../animations/fade-in-up.animation";
import { stagger40ms } from "../../animations/stagger.animation";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatSort)
  sort: MatSort;

  @Input()
  columns: TableColumn<any>[];
  @Input()
  dataSource: MatTableDataSource<any> | null;

  @Output()
  public orderBy: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public onUpdate: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  public onDelete: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  update(id: number): void {
    this.onUpdate.emit(id);
  }

  delete(id: number): void {
    this.onDelete.emit(id);
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction === 'asc') {
      this.orderBy.emit(sortState.active);
    } else if (sortState.direction === 'desc') {
      this.orderBy.emit(`-${sortState.active}`);
    }
  }
}
