import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Sort } from "@angular/material/sort";
import { convertCamelCaseToSnakeCase } from "./utils";
import { Filters } from "../../core/interfaces/filters";

export const getPaginateParams = (sort: string, itemsPerPage: number, page: number, search: string|null): HttpParams => {
  return new HttpParams()
    .append('sort', sort)
    .append('per_page', itemsPerPage)
    .append('page', page)
    .append('q', (search === null) ? '' : encodeURI(search));
}

export const getSort = (sortState: Sort): string =>  {
  if (sortState.direction === 'asc') {
    return convertCamelCaseToSnakeCase(sortState.active);
  } else if (sortState.direction === 'desc') {
    return `-${convertCamelCaseToSnakeCase(sortState.active)}`;
  } else {
    return '';
  }
}

export const getFiltersQueryParams = (filters: Filters): HttpParams => {
  return new HttpParams()
    .append('q', (filters.filters.length === 0) ? '' : encodeURI(JSON.stringify(filters)));
}

export const acceptApplicationPdfHeader = (): HttpHeaders => {
  return new HttpHeaders().set('Accept', 'application/pdf');
}

export const acceptApplicationExcelHeader = (): HttpHeaders => {
  return new HttpHeaders().set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9');
}
