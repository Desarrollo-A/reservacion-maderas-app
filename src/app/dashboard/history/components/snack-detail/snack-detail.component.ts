import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { stagger40ms } from "../../../../shared/animations/stagger.animation";
import { MatTableDataSource } from "@angular/material/table";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { InventoryModel } from "../../../../core/models/inventory.model";
import { MatSort } from "@angular/material/sort";
import { FormControl } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatDialog } from "@angular/material/dialog";
import { SnackAssignComponent } from "../snack-assign/snack-assign.component";
import { DeleteConfirmComponent } from "../../../../shared/components/delete-confirm/delete-confirm.component";
import { ToastrService } from "ngx-toastr";
import { Lookup } from "../../../../core/interfaces/lookup";
import { InventoryRequestService } from "../../../../core/services/inventory-request.service";
import { StatusRequestRoomLookup } from "../../../../core/enums/lookups/status-request-room.lookup";
import { InventoryRequestModel } from "../../../../core/models/inventory-request.model";
import { UserSessionService } from "../../../../core/services/user-session.service";
import { NameRole } from "../../../../core/enums/name-role";
import { trackById } from "../../../../shared/utils/track-by";

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
  @Input()
  previousStatus: Lookup;
  @Input()
  requestId: number;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  dataSource: MatTableDataSource<InventoryModel> | null;
  searchCtrl = new FormControl();
  columns: TableColumn<InventoryModel>[] = [];

  trackById = trackById;

  constructor(private dialog: MatDialog,
              private toastrService: ToastrService,
              private inventoryRequestService: InventoryRequestService,
              private userSessionService: UserSessionService) {
    this.columns = [
      { label: 'Nombre', property: 'name', type: 'text', visible: true },
      { label: 'Cantidad', property: 'quantity', type: 'text', visible: true }
    ];

    if (this.isRecepcionist) {
      this.columns.push({ label: 'Acciones', property: 'actions', type: 'button', visible: true });
    }
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<InventoryModel>(this.snacks);

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  get isRecepcionist(): boolean {
    return this.userSessionService.user?.role?.name === NameRole.RECEPCIONIST;
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
      }).afterClosed().subscribe((result: InventoryModel) => {
        if (result) {
          this.saveSnack(result);
        }
      });
    } else {
      this.dialog.open(SnackAssignComponent, {
        data: { snacks: this.filterSnacksWasSelected(), row: {... snack} },
        autoFocus: false,
        width: '350px'
      }).afterClosed().subscribe((result: InventoryModel) => {
        if (result) {
          this.updateSnack(result);
        }
      });
    }
  }

  deleteItem(snack: InventoryModel): void {
    this.dialog.open(DeleteConfirmComponent, { autoFocus: false }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          if (!snack.inventoryRequest.createdAt) {
            this.snacks.splice(this.findSnackIndex(this.snacks, snack), 1);
            this.dataSource.data = this.snacks;
            this.toastrService.success('Snack eliminado', 'Proceso exitoso');
          } else {
            this.inventoryRequestService.delete(snack.inventoryRequest).subscribe(() => {
              this.snacks.splice(this.findSnackIndex(this.snacks, snack), 1);
              this.dataSource.data = this.snacks;
              this.toastrService.success('Snack eliminado', 'Proceso exitoso');
            });
          }
        }
      });
  }

  private saveSnack(snack: InventoryModel): void {
    if (this.previousStatus.code === StatusRequestRoomLookup[StatusRequestRoomLookup.NEW] ||
        this.previousStatus.code === StatusRequestRoomLookup[StatusRequestRoomLookup.IN_REVIEW]) {
      this.snacks.push(snack);
      this.dataSource.data = this.snacks;
    } else if (this.previousStatus.code === StatusRequestRoomLookup[StatusRequestRoomLookup.APPROVED]) {
      const data = <InventoryRequestModel>{
        requestId: this.requestId,
        inventoryId: snack.id,
        quantity: snack.inventoryRequest.quantity
      };
      this.inventoryRequestService.store(data).subscribe(inventoryRequest => {
        this.toastrService.success('Snack asignado', 'Proceso exitoso');
        snack.inventoryRequest = inventoryRequest;
        this.snacks.push(snack);
        this.dataSource.data = this.snacks;
      });
    }
  }

  private updateSnack(snack: InventoryModel): void {
    if (this.previousStatus.code === StatusRequestRoomLookup[StatusRequestRoomLookup.NEW] ||
        this.previousStatus.code === StatusRequestRoomLookup[StatusRequestRoomLookup.IN_REVIEW]) {
      const index = this.findSnackIndex(this.snacks, snack);
      this.snacks[index].inventoryRequest.quantity = snack.inventoryRequest.quantity;
      this.dataSource.data = this.snacks;
    } else if (this.previousStatus.code === StatusRequestRoomLookup[StatusRequestRoomLookup.APPROVED]) {
      const data = <InventoryRequestModel>{
        requestId: this.requestId,
        inventoryId: snack.id,
        quantity: snack.inventoryRequest.quantity
      };
      this.inventoryRequestService.update(data).subscribe(() => {
        this.toastrService.success('Snack actualizado', 'Proceso exitoso');
        const index = this.findSnackIndex(this.snacks, snack);
        this.snacks[index].inventoryRequest.quantity = snack.inventoryRequest.quantity;
        this.dataSource.data = this.snacks;
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

