import { Lookup } from "../interfaces/lookup";
import { OfficeModel } from "./office.model";
import { StatusUserLookup } from "../enums/lookups/status-user.lookup";
import { RoleModel } from "./role.model";
import { OfficeManagerModel } from "./office-manager.model";

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
  isAssistant?: boolean;
  role: RoleModel;
  managers?: string[];
  departmentManagerId?: number;
  officeManager: OfficeManagerModel;

  constructor(user) {
    this.id = user.id;
    this.noEmployee = user.noEmployee ?? user.num_empleado;
    this.fullName = user.fullName ?? user.nombre_completo;
    this.email = user.email ?? user.email_empresarial;
    this.password = user.password;
    this.personalPhone = user.personalPhone ?? user.tel_personal;
    this.officePhone = user.officePhone ?? user.tel_oficina;
    this.position = user.position ?? user.puesto;
    this.managers = user.director;
    this.area = user.area;
    this.statusId = user.statusId;
    this.status = user.status;
    this.roleId = user.roleId;
    this.officeId = user.officeId;
    this.office = user.office;
    this.role = user.role;
    this.departmentManagerId = user.departmentManagerId;
    this.officeManager = user.officeManager;
  }

  get statusName(): string {
    return this.status.value;
  }

  get labelStatus(): { text: string, textClass: string, bgClass: string } {
    if (this.status.code === StatusUserLookup[StatusUserLookup.ACTIVE]) {
      return { text: this.statusName, textClass: 'text-green', bgClass: 'bg-green-light' };
    } else if (this.status.code === StatusUserLookup[StatusUserLookup.INACTIVE]) {
      return { text: this.statusName, textClass: 'text-red', bgClass: 'bg-red-light' };
    } else if (this.status.code === StatusUserLookup[StatusUserLookup.BLOCKED]){
      return { text: this.statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };
    }
  }
}
