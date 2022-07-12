import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { fadeInUp400ms } from "../../../shared/animations/fade-in-up.animation";

@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss'],
  animations: [fadeInUp400ms]
})
export class EmployeeRegisterComponent implements OnInit {
  @Output()
  checkUser: EventEmitter<string> = new EventEmitter<string>();


  form = this.fb.group({
    noEmployee: ['', Validators.required]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {}

  send() {
    this.checkUser.emit(this.form.controls.noEmployee.value);
  }

  backToLogin(): void {
    this.router.navigateByUrl('/auth/acceso');
  }
}
