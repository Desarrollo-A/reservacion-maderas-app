import { HttpParams } from "@angular/common/http";
import { Sort } from "@angular/material/sort";
import { convertCamelCaseToSnakeCase } from "./utils";

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
