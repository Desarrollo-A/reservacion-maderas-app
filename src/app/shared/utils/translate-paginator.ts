import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { Subject } from "rxjs";

@Injectable()
export class TranslatePaginator implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = 'Primera página';
  itemsPerPageLabel = 'Registros por página:';
  lastPageLabel = 'Última página';
  nextPageLabel = 'Página siguiente';
  previousPageLabel = 'Página anterior';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Página 1 de 1. Total de 0 registros`;
    }
    const amountPages = Math.ceil(length / pageSize);
    let totalLength: string;

    if (length === 1) {
      totalLength = 'Total de 1 registro';
    } else {
      totalLength = `Total de ${length.toLocaleString('en-US')} registros`;
    }

    return `Página ${page + 1} de ${amountPages}. ${totalLength}`;
  }
}
