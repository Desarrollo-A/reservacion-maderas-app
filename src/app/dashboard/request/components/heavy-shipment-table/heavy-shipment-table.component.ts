import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { HeavyShipmentModel } from "../../../../core/models/heavy-shipment.model";
import { FormControl } from "@angular/forms";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ItemCreateUpdateComponent } from "./item-create-update/item-create-update.component";

@UntilDestroy()
@Component({
  selector: 'app-heavy-shipment-table',
  templateUrl: './heavy-shipment-table.component.html',
  styles: [],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class HeavyShipmentTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  dataSource: MatTableDataSource<HeavyShipmentModel> | null;
  searchCtrl = new FormControl();
  columns: TableColumn<HeavyShipmentModel>[] = [];
  heavyshipments: HeavyShipmentModel[] = [];

  constructor(
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    this.columns = [
      { label: 'Altura', property: 'high', type: 'text', visible: true },
      { label: 'Largo', property: 'long', type: 'text', visible: true },
      { label: 'Ancho', property: 'width', type: 'text', visible: true },
      { label: 'Peso', property: 'weight', type: 'text', visible: true },
      { label: 'Descripción', property: 'description', type: 'text', visible: true },
      { label: 'Acciones', property: 'actions', type: 'text', visible: true },
    ];
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<HeavyShipmentModel>(this.heavyshipments);

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

  openDialog(item?: HeavyShipmentModel): void {
    let config = {
      autoFocus: false,
      data: (item) ? item : undefined
    };

    this.dialog.open(ItemCreateUpdateComponent, config)
      .afterClosed()
      .subscribe((result?: HeavyShipmentModel) => {
        if (!result) {
          return;
        }

        if (!item) {
          this.saveItem(result)
        } else {
          this.updateItem(result);
        }
      });
  }

  deleteItem(item: HeavyShipmentModel): void {
    const index = this.findIndex(item.id);
    this.heavyshipments.splice(index, 1);
    this.dataSource.data = this.heavyshipments;

    this.toastrService.success('Artículo eliminado', 'Proceso exitoso');
  }

  private saveItem(item: HeavyShipmentModel): void {
    this.heavyshipments.push(item);
    this.dataSource.data = this.heavyshipments;

    this.toastrService.success('Artículo agregado', 'Proceso exitoso');
  }

  private updateItem(item: HeavyShipmentModel): void {
    const index = this.findIndex(item.id);
    this.heavyshipments[index] = item;
    this.dataSource.data = this.heavyshipments;

    this.toastrService.success('Artículo actualizado', 'Proceso exitoso');
  }

  private onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }

    value = value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  private findIndex(id: string|number): number {
    return this.heavyshipments.findIndex(item => {
      return item.id === id;
    });
  }
}
