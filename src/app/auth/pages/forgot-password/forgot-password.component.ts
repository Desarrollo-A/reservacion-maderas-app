import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from "../../../shared/animations/fade-in-up.animation";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [fadeInUp400ms]
})
export class ForgotPasswordComponent implements OnInit {
  form = this.fb.group({
    email: [null, Validators.required]
  });

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit() {
  }

  send() {
    this.router.navigate(['/']);
  }

  backToLogin(): void {
    this.router.navigateByUrl('/auth/acceso');
  }
}
