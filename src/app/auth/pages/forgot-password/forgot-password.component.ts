import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../shared/animations/fade-in-up.animation";
import { UntypedFormBuilder, Validators, FormGroup } from "@angular/forms";
import { FormErrors } from "../../../shared/utils/form-error";
import { Router } from "@angular/router";
import { User } from "../../../core/interfaces/user";
import { AuthService } from "../../../core/services/auth.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [fadeInUp400ms]
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
    email: [null,[Validators.required, Validators.maxLength(120),Validators.email]],
    });
    this.formErrors = new FormErrors(this.form);
  }

  send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email: User = this.form.getRawValue();
    this.authService.forgotPassword(email).subscribe(() => {
      this.toastrService.success('El correo ha sido enviado','Proceso éxitoso');
      this.backToLogin();
    });
  }

  backToLogin(): void {
    this.router.navigateByUrl('/auth/acceso');
  }
}
