import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";

@Component({
  selector: 'app-delivered-package',
  templateUrl: './delivered-package.component.html',
  styleUrls: ['./delivered-package.component.scss']
})
export class DeliveredPackageComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nameReceive: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    });

    this.formErrors = new FormErrors(this.form);
  }

}
