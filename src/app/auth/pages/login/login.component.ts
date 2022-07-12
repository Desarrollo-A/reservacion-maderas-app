import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../shared/animations/fade-in-up.animation";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FormErrors } from "../../../shared/utils/form-error";
import { User } from "../../interfaces/user";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  inputType = 'password';
  tooltipPassword = 'Visualizar contraseña';
  visible = false;

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthService) {}

  ngOnInit() {
    const data  = JSON.parse(localStorage.getItem('credentials'));

    this.form = this.fb.group({
      noEmployee: [(data) ? data.noEmployee : '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: [(data) ? data.password : '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      rememberMe: [(data) ? data.rememberMe : false]
    });

    this.formErrors = new FormErrors(this.form);
  }

  send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user: User = this.form.getRawValue();
    this.authService.login(user).subscribe(() => {
      this.router.navigateByUrl('/dashboard');
    });
  }

  toggleVisibility(): void {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.tooltipPassword = 'Visualizar contraseña';
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.tooltipPassword = 'Ocultar contraseña';
    }
  }

}
