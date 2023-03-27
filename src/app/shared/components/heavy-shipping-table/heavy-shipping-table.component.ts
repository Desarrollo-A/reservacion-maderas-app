import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { fadeInUp400ms } from "../../animations/fade-in-up.animation";
import { stagger40ms } from "../../animations/stagger.animation";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { HeavyShipmentModel } from "../../../core/models/heavy-shipment.model";
import { FormControl } from "@angular/forms";
import { TableColumn } from "../../interfaces/table-column.interface";
import { MatDialog } from "@angular/material/dialog";
import { HeavyShippingDetailComponent } from "./heavy-shipping-detail/heavy-shipping-detail.component";

@UntilDestroy()
@Component({
  selector: 'app-heavy-shipping-table',
  templateUrl: './heavy-shipping-table.component.html',
  styles: [],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ]
})
export class HeavyShippingTableComponent implements OnInit, AfterViewInit {
  @Input()
  heavyshipments: HeavyShipmentModel[] = [];

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  dataSource: MatTableDataSource<HeavyShipmentModel> | null;
  searchCtrl = new FormControl();
  columns: TableColumn<HeavyShipmentModel>[] = [
    { label: 'Altura', property: 'high', type: 'text', visible: true },
    { label: 'Largo', property: 'long', type: 'text', visible: true },
    { label: 'Ancho', property: 'width', type: 'text', visible: true },
    { label: 'Peso', property: 'weight', type: 'text', visible: true },
    { label: 'Descripción', property: 'description', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'text', visible: true },
  ];

  constructor(
    private dialog: MatDialog
  ) { }

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

  openDialog(id: number): void {
    this.dialog.open(HeavyShippingDetailComponent, {
      autoFocus: false,
      data: this.heavyshipments.find(hs => hs.id === id),
      width: '500px'
    });
  }

  private onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }

    value = value.trim().toLowerCase();
    this.dataSource.filter = value;
  }
}
