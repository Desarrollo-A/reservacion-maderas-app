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
  /**
   * TODO: Revisar cómo se llama el campo que viene del endpoint de CH
   */
  num_empleado_director?: string;
}

export enum Result {
  NOT_EXIST,
  USER_LOW,
  ACTIVE_WITHOUT_EMAIL,
  ACTIVE_WITH_EMAIL
}
