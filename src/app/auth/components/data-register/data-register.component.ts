import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeInUp400ms } from "../../../shared/animations/fade-in-up.animation";
import { UserModel } from "../../../dashboard/user/models/user.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../shared/utils/form-error";
import { comparePassword } from "../../../shared/utils/form-validations";

@Component({
  selector: 'app-data-register',
  templateUrl: './data-register.component.html',
  styleUrls: ['./data-register.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class DataRegisterComponent implements OnInit {
  @Input()
  data: UserModel;

  @Output()
  backTo: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  register: EventEmitter<UserModel> = new EventEmitter<UserModel>();

  form: FormGroup;
  formErrors: FormErrors;

  inputTypeNew = 'password';
  tooltipPasswordNew = 'Visualizar contraseña';
  visibleNew = false;

  inputTypeConfirm = 'password';
  tooltipPasswordConfirm = 'Visualizar contraseña';
  visibleConfirm = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      confirmPassword: ['']
    },{
      validators: [comparePassword('password', 'confirmPassword')]
    })

    this.formErrors = new FormErrors (this.form);
  }

  toggleVisibility(isInputPassword: boolean): void {
    if (isInputPassword) {
      if (this.visibleNew) {
        this.inputTypeNew = 'password';
        this.visibleNew = false;
        this.tooltipPasswordNew = 'Visualizar Contraseña'
      } else {
        this.inputTypeNew = 'text';
        this.visibleNew = true;
        this.tooltipPasswordNew = 'Ocultar Contraseña'
      }
    } else if (this.visibleConfirm) {
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

    const { password } = this.form.getRawValue();
    this.data.password = password;
    this.register.emit(this.data);
  }
}
