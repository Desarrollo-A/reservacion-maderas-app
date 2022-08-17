import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { InventoryModel } from "../../../inventory/models/inventory.model";
import { MatSort } from "@angular/material/sort";
import { FormControl } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatDialog } from "@angular/material/dialog";
import { SnackAssignComponent } from "../snack-assign/snack-assign.component";

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
  @Input()
  snackList: InventoryModel[] = [];

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  dataSource: MatTableDataSource<InventoryModel> | null;
  searchCtrl = new FormControl();
  columns: TableColumn<InventoryModel>[] = [
    { label: 'Nombre', property: 'name', type: 'text', visible: true },
    { label: 'Cantidad', property: 'quantity', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  constructor(private dialog: MatDialog) {}

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

  openDialog(snack?: InventoryModel): void {
    if (!snack) {
      this.dialog.open(SnackAssignComponent, {
        data: { snacks: this.snackList },
        autoFocus: false,
        width: '350px'
      });
      // TODO: falta de implementar la recarga de los datoa de la tabla
    }
  }
}

