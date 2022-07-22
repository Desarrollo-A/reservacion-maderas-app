import { Lookup } from "../../../core/interfaces/lookup";
import { OfficeModel } from "../../../core/models/office.model";

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

  constructor(user) {
    this.id = user.id;
    this.noEmployee = user.noEmployee ?? user.num_empleado;
    this.fullName = user.fullName ?? user.nombre_completo;
    this.email = user.email ?? user.email_empresarial;
    this.password = user.password;
    this.personalPhone = user.personalPhone ?? user.tel_personal;
    this.officePhone = user.officePhone ?? user.tel_oficina;
    this.position = user.position ?? user.puesto;
    this.area = user.area ?? user.area;
    this.statusId = user.statusId;
    this.status = user.status;
    this.roleId = user.roleId;
    this.officeId = user.officeId;
    this.office = user.office;
  }
}
