import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { InventoryModel } from "../../../inventory/models/inventory.model";
import { MatSort } from "@angular/material/sort";
import { FormControl } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-snack-detail',
  templateUrl: './snack-detail.component.html',
  styleUrls: ['./snack-detail.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class SnackDetailComponent implements OnInit, AfterViewInit {
  @Input()
  snacks: InventoryModel[] = [];

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  dataSource: MatTableDataSource<InventoryModel> | null;
  columns: TableColumn<InventoryModel>[] = [
    { label: 'Nombre', property: 'name', type: 'text', visible: true },
    { label: 'Cantidad', property: 'quantity', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  searchCtrl = new FormControl();

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<InventoryModel>(this.snacks);

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  private onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }
}
