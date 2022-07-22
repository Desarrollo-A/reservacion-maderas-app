import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { fadeInUp400ms } from "../../../shared/animations/fade-in-up.animation";
import { FormErrors } from "../../../shared/utils/form-error";

@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss'],
  animations: [fadeInUp400ms]
})
export class EmployeeRegisterComponent implements OnInit {
  @Output()
  checkUser: EventEmitter<string> = new EventEmitter<string>();

  form: FormGroup;
  formErrors: FormErrors;

  constructor(private router: Router,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      noEmployee: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  check(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.checkUser.emit(this.form.controls.noEmployee.value);
  }

  backToLogin(): void {
    this.router.navigateByUrl('/auth/acceso');
  }
}
