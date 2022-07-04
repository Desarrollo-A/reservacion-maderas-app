export interface Filters {
  filters: Filter[];
}

export interface Filter {
  field: string;
  type: TypesEnum;
  value: any
}

export enum TypesEnum {
  Array = 'array',
  Boolean = 'boolean',
  Date = 'date',
  Double = 'double',
  Int = 'int',
  String = 'string'
}
