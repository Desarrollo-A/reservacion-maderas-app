import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormErrors } from 'src/app/shared/utils/form-error';
import { comparePassword } from "../../../../../utils/form-validations";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  inputTypeCurrent = 'password';
  tooltipPasswordCurrent = 'Visualizar contraseña';
  visibleCurrent = false;

  inputTypeNew = 'password';
  tooltipPasswordNew = 'Visualizar contraseña';
  visibleNew = false;

  inputTypeConfirm = 'password';
  tooltipPasswordConfirm = 'Visualizar contraseña';
  visibleConfirm = false;

  constructor(
    private fb: FormBuilder,
    private authService : AuthService,
    private toastService: ToastrService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPassword: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      password: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]]
    },{
      validators: [comparePassword('password', 'confirmPassword')]
    });

    this.formErrors = new FormErrors (this.form);
  }

  toggleVisibility(input: 'current' | 'new' | 'confirm'): void {
    if (input === 'current') {
      if (this.visibleCurrent) {
        this.inputTypeCurrent = 'password';
        this.visibleCurrent = false;
        this.tooltipPasswordCurrent = 'Visualizar Contraseña'
      } else {
        this.inputTypeCurrent = 'text';
        this.visibleCurrent = true;
        this.tooltipPasswordCurrent = 'Ocultar Contraseña'
      }
    } else if (input === 'new') {
      if (this.visibleNew) {
        this.inputTypeNew = 'password';
        this.visibleNew = false;
        this.tooltipPasswordNew = 'Visualizar Contraseña'
      } else {
        this.inputTypeNew = 'text';
        this.visibleNew = true;
        this.tooltipPasswordNew = 'Ocultar Contraseña'
      }
    } else if (input === 'confirm') {
      if (this.visibleConfirm) {
        this.inputTypeConfirm = 'password';
        this.visibleConfirm = false;
        this.tooltipPasswordConfirm = 'Visualizar Contraseña'
      } else {
        this.inputTypeConfirm = 'text';
        this.visibleConfirm = true;
        this.tooltipPasswordConfirm = 'Ocultar Contraseña'
      }
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user: User = this.form.getRawValue();
    this.authService.changePassword(user).subscribe(() => {
      this.toastService.success('La contraseña se ha modificado correctamente','Proceso exitoso');
      this.dialogRef.close(true);
    });
  }
}
