import { Lookup } from "../interfaces/lookup";
import { OfficeModel } from "./office.model";
import { StatusUserLookup } from "../enums/lookups/status-user.lookup";
import { LabelButton } from "../../shared/interfaces/label-button";

export class UserModel {
  id: number;
  noEmployee: string;
  fullName: string;
  email: string;
  password: string;
  personalPhone: string;
  officePhone: string;
  position: string;
  area: string;
  statusId: number;
  status: Lookup;
  roleId: number;
  officeId: number;
  office: OfficeModel;
  isRecepcionist?: boolean;
  role: Lookup;
  departmentManagerId?: number;
  departmentManagerNoEmployee?: UserModel;

  constructor(user) {
    this.id = user.id;
    this.noEmployee = user.noEmployee ?? user.num_empleado;
    this.fullName = user.fullName ?? user.nombre_completo;
    this.email = user.email ?? user.email_empresarial;
    this.password = user.password;
    this.personalPhone = user.personalPhone ?? user.tel_personal;
    this.officePhone = user.officePhone ?? user.tel_oficina;
    this.position = user.position ?? user.puesto;
    this.area = user.area;
    this.statusId = user.statusId;
    this.status = user.status;
    this.roleId = user.roleId;
    this.officeId = user.officeId;
    this.office = user.office;
    this.role = user.role;
    this.departmentManagerId = user.departmentManagerId;
    /**
     * TODO: Quitar el hardcode de la clave del director de departamento
     */
    this.departmentManagerNoEmployee = user.departmentManagerNoEmployee ?? user.num_empleado_director;
  }

  get statusName(): string {
    return this.status.name;
  }

  get labelStatus(): LabelButton {
    if (this.status.code === StatusUserLookup[StatusUserLookup.ACTIVE]) {
      return { text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.status.code === StatusUserLookup[StatusUserLookup.INACTIVE]) {
      return { text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light' };
    } else if (this.status.code === StatusUserLookup[StatusUserLookup.BLOCKED]){
      return { text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };
    }
  }
}
