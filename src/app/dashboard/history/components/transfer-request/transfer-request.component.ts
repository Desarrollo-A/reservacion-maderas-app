import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { OfficeModel } from "../../../../core/models/office.model";
import { OfficeService } from "../../../../core/services/office.service";
import { trackById } from "../../../../shared/utils/track-by";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { ToastrService } from "ngx-toastr";

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
  officeId: number;

  offices: OfficeModel[] = [];
  form: FormGroup;
  formErrors: FormErrors;

  trackById = trackById;

  constructor(private officeService: OfficeService,
              private fb: FormBuilder,
              private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.officeService.getByStateWithDriverWithoutOffice(this.officeId).subscribe(offices => {
      this.offices = offices;
      if (offices.length === 0) {
        this.toastrService.info('No hay oficinas con choferes disponibles', 'Información');
      }
    });

    this.form = this.fb.group({
      officeId: [null, Validators.required]
    });

    this.formErrors = new FormErrors(this.form);
  }
}
