import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/auth/interfaces/user';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormErrors } from 'src/app/shared/utils/form-error';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

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
      password: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      confirmPassword: ['']
    },{
      validators: [this.comparePassword('password', 'confirmPassword')]
    })

    this.formErrors = new FormErrors (this.form);
  }

  toggleVisibilityNew(): void {
    if (this.visibleNew) {
      this.inputTypeNew = 'password';
      this.visibleNew = false;
      this.tooltipPasswordNew = 'Visualizar Contraseña'
    } else {
      this.inputTypeNew = 'text';
      this.visibleNew = true;
      this.tooltipPasswordNew = 'Ocultar Contraseña'
    }
  }

  toggleVisibilityConfirm(): void {
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

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user:User = this.form.getRawValue();
    this.authService.changePassword(user).subscribe(() => {
      this.toastService.success('La contraseña se ha modificado correctamente','Proceso exitoso');
      this.dialogRef.close(true);
    });
  }

  comparePassword(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const pass1 = formGroup.get(password)?.value;
      const pass2 = formGroup.get(confirmPassword)?.value;

      if (pass1 !== pass2) {
        let error = { differentPassword: true };
        formGroup.get(confirmPassword)?.setErrors(error);
        return error;
      }
      formGroup.get(confirmPassword)?.setErrors(null);
      return null;
    }
  }
}
