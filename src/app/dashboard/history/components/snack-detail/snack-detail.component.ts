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
import { DeleteConfirmComponent } from "../../../../shared/components/delete-confirm/delete-confirm.component";
import { ToastrService } from "ngx-toastr";

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
  snacks: InventoryModel[] = []; // Listado de snacks asignados
  @Input()
  snackList: InventoryModel[] = []; // Listado de todos los snacks de la BD para asignar

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  dataSource: MatTableDataSource<InventoryModel> | null;
  searchCtrl = new FormControl();
  columns: TableColumn<InventoryModel>[] = [
    { label: 'Nombre', property: 'name', type: 'text', visible: true },
    { label: 'Cantidad', property: 'quantity', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  constructor(private dialog: MatDialog,
              private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<InventoryModel>(this.snacks);

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  openDialog(snack?: InventoryModel): void {
    if (!snack) {
      this.dialog.open(SnackAssignComponent, {
        data: { snacks: this.filterSnacksWasSelected() },
        autoFocus: false,
        width: '350px'
      }).afterClosed().subscribe((snack: InventoryModel) => {
        if (snack) {
          this.snacks.push(snack);
          this.dataSource.data = this.snacks;
        }
      });
    } else {
      this.dialog.open(SnackAssignComponent, {
        data: { snacks: this.filterSnacksWasSelected(), row: snack },
        autoFocus: false,
        width: '350px'
      }).afterClosed().subscribe((snack: InventoryModel) => {
        if (snack) {
          const index = this.findSnackIndex(this.snacks, snack);
          this.snacks[index].inventoryRequest.quantity = snack.inventoryRequest.quantity;
          this.dataSource.data = this.snacks;
        }
      });
    }
  }

  deleteItem(snack: InventoryModel): void {
    if (!snack.inventoryRequest.createdAt) {
      this.dialog.open(DeleteConfirmComponent, { autoFocus: false }).afterClosed()
        .subscribe(confirm => {
          if (confirm) {
            this.snacks.splice(this.findSnackIndex(this.snacks, snack), 1);
            this.dataSource.data = this.snacks;
            this.toastrService.success('Snack eliminado', 'Proceso exitoso');
          }
        });
    }
  }

  private filterSnacksWasSelected(): InventoryModel[] {
    let snacks = [... this.snackList];
    this.snacks.forEach(snack => {
      snacks.splice(this.findSnackIndex(snacks, snack), 1);
    });
    return snacks;
  }

  private findSnackIndex(snacks: InventoryModel[], snack: InventoryModel): number {
    return snacks.findIndex(inventory => {
      return inventory.id === snack.id;
    });
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

