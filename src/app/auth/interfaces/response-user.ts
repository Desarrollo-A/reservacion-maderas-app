export interface ResponseUser {
  resultado: number;
  data?: DataUser[]
}

interface DataUser {
  num_empleado: string;
  nombre_completo: string;
  tel_personal: string;
  puesto: string;
  area: string;
  sede: string;
  nom_oficina: string;
  email_empresarial?: string;
  tel_oficina?: string;
}

export enum Result {
  NOT_EXIST = 0,
  USER_LOW = 1,
  ACTIVE_WITHOUT_EMAIL = 2,
  ACTIVE_WITH_EMAIL = 3
}
