import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { OfficeModel } from "../../../../core/models/office.model";
import { trackById } from "../../../../shared/utils/track-by";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";

@Component({
  selector: 'app-transfer-request',
  templateUrl: './transfer-request.component.html',
  styleUrls: ['./transfer-request.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class TransferRequestComponent implements OnInit {
  @Input()
  offices: OfficeModel[] = [];

  form: FormGroup;
  formErrors: FormErrors;

  trackById = trackById;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      officeId: [null, Validators.required]
    });

    this.formErrors = new FormErrors(this.form);
  }
}
