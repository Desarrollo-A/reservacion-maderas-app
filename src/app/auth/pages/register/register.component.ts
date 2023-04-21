import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../core/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { Result } from "../../../core/interfaces/response-user";
import { UserModel } from "../../../core/models/user.model";
import { OfficeModel } from "../../../core/models/office.model";
import { StateModel } from "../../../core/models/state.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formHide = true;
  userData: UserModel;

  constructor(private authService: AuthService,
              private toastrService: ToastrService,
              private router: Router) {}

  ngOnInit() {}

  checkUser(noEmployee: string): void {
    this.authService.checkEmployee(noEmployee).subscribe(({resultado, data}) => {
      if (resultado === Result.NOT_EXIST) {
        this.toastrService.warning('No existe el registro', 'Atención');
      } else if (resultado === Result.USER_LOW) {
        this.toastrService.warning('Colaborador dado de baja.', 'Atención');
      } else if (resultado === Result.ACTIVE_WITHOUT_EMAIL) {
        this.toastrService.warning('No tiene correo corporativo. Favor de acercarse a Capital Humano',
          'Colaborador sin correo');
      } else if (resultado === Result.ACTIVE_WITH_EMAIL) {
        const response = data[0];

        if (response.puesto.toUpperCase().includes('CHOFER')) {
          this.toastrService.warning('Colaboradores con puesto "CHOFER" ya están registrados en el sistema', 'Atención');
          return;
        }

        if (
          (
            response.puesto.toUpperCase().includes('DIRECCION') || response.puesto.toUpperCase().includes('DIRECTOR')
          ) &&
          !response.puesto.toUpperCase().includes('ASISTENTE')
        ) {
          this.toastrService.warning('Colaboradores con puesto "DIRECTOR" ya están registrados en el sistema', 'Atención');
          return;
        }

        if (response.director === false) {
          this.toastrService.warning('No tiene un director asignado. Favor de acercarse a Capital Humano', 'Atención');
          return;
        }

        let state = new StateModel(response);
        const office = new OfficeModel(response);
        let user = new UserModel(response);
        user.isRecepcionist = (user.position.toUpperCase() === 'RECEPCIONISTA' ||
          user.position.toUpperCase().includes('ASISTENTE'));
        user.office = office;
        user.office.state = state;
        this.userData = user;

        this.formHide = false;
      }
    });
  }

  backToCheckUser(): void {
    this.formHide = true;
    this.userData = null;
  }

  register(user: UserModel): void {
    this.authService.createUser(user).subscribe(() => {
      this.toastrService.success('Usuario registrado.','Proceso exitoso');
      this.router.navigateByUrl('/dashboard');
    });
  }
}
