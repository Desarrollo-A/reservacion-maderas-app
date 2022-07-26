import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { Lookup } from 'src/app/core/interfaces/lookup';
import { InventoryModel } from 'src/app/dashboard/inventory/models/inventory-model';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { stagger40ms } from 'src/app/shared/animations/stagger.animation';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';

@UntilDestroy()
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})

export class InventoryComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator,{static: true})
  paginator: MatPaginator;
  @ViewChild(MatSort, {static:true})
  sort: MatSort;

  inventorys: InventoryModel[];
  columns: TableColumn<InventoryModel>[] = [
    {label: 'Nombre', property: 'name', type: 'text', visible: true},
    {label: 'Descripción', property: 'description', type: 'text', visible: true},
    {label: 'Stock', property: 'cantidadStock', type: 'text', visible: true},
    {label: 'Estatus', property: 'status', type: 'button', visible: true },
    {label: 'Tipo Inv.', property: 'typeInventory', type: 'button', visible: true },
    {label: 'Unidad', property: 'unit', type: 'button', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<InventoryModel> | null;
  searchCtrl = new UntypedFormControl();

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.getData().subscribe(inventorys => {
      this.inventorys = inventorys;
      this.dataSource.data = inventorys;
    });

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  toggleColumnVisibility(column, event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  getData(): Observable<InventoryModel[]> {
    return of<InventoryModel[]>([
      {name:'Lápiz #2', description: 'Lapiz de madera  - paq con 12 pzas.', cantidadStock: 2, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Papeleria'} , unit: <Lookup>{name: 'Pieza'},  },
      {name:'Marcatextos', description: 'Marcatextos fosforecente de 6mm', cantidadStock: 5, status: <Lookup>{name: 'Inactivo'}, typeInventory: <Lookup>{name: 'Papeleria'} , unit: <Lookup>{name: 'Pieza'},  },
      {name:'Pegamento en barra', description: 'Pegamento tipo barra - 22g', cantidadStock: 2, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Papeleria'} , unit: <Lookup>{name: 'Pieza'},  },

      {name:'Gasa Le Roy', description: 'Gasa absolvente esteril - 7.5 x 5 cm', cantidadStock: 7, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Botiquin'} , unit: <Lookup>{name: 'Sobre'},  },
      {name:'Venda', description: 'Venda elástica - 7.5 x 5 m', cantidadStock: 3, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Botiquin'} , unit: <Lookup>{name: 'Paquete'},  },
      {name:'Buscapina', description: 'Pastillas de 250/500 grs - Caja con 10 tabletas', cantidadStock: 6, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Botiquin'} , unit: <Lookup>{name: 'Caja'},  },

      {name:'SANITAS INTERDOBLADAS', description: 'SANITAS INTERDOBLADAS', cantidadStock: 9, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Limpieza'} , unit: <Lookup>{name: 'Caja'},  },
      {name:'ROLLO DE PAPEL', description: 'ROLLO DE PAPEL', cantidadStock: 4, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Limpieza'} , unit: <Lookup>{name: 'Caja'},  },
      {name:'RECARGA DE DIFUSOR GLADE ÁRAISO AZUL', description: 'RECARGA DE DIFUSOR GLADE ÁRAISO AZUL', cantidadStock: 2, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Limpieza'} , unit: <Lookup>{name: 'Pieza'},  },

      {name:'Cafe de grano', description: 'Pegamento tipo barra - 22g', cantidadStock: 2, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Cafetería'} , unit: <Lookup>{name: 'Kilo'},  },
      {name:'Crema en polvo', description: 'Coffe mate', cantidadStock: 2, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Cafetería'} , unit: <Lookup>{name: 'Bote'},  },
      {name:'Galletas Mariam', description: 'Marian majetic', cantidadStock: 3, status: <Lookup>{name: 'Activo'}, typeInventory: <Lookup>{name: 'Cafetería'} , unit: <Lookup>{name: 'Caja'},  },
    ].map(inventory => new InventoryModel(inventory)));
  }

}
