import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { Result } from "../../interfaces/response-user";
import { UserModel } from "../../../dashboard/user/models/user.model";
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
        this.toastrService.warning('Empleado dado de baja.', 'Atención');
      } else if (resultado === Result.ACTIVE_WITHOUT_EMAIL) {
        this.toastrService.warning('No tiene correo corporativo. Favor de acercarse a Capital Humano',
          'Empleado sin correo');
      } else if (resultado === Result.ACTIVE_WITH_EMAIL) {
        let state = new StateModel(data[0]);
        const office = new OfficeModel(data[0]);
        let user = new UserModel(data[0]);
        user.isRecepcionist = (user.position.toUpperCase() === 'RECEPCIONISTA');
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
