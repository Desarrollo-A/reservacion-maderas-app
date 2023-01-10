import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PackageModel } from "../../../../core/models/package.model";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { dateBeforeNow } from "../../../../shared/utils/form-validations";
import { ToastrService } from "ngx-toastr";
import { RequestPackageService } from "../../../../core/services/request-package.service";
import { getDateFormat } from "../../../../shared/utils/utils";
import { ProposalRequestModel } from "../../../../core/models/proposal-request.model";

@Component({
  selector: 'app-proposal-request-package',
  templateUrl: './proposal-request-package.component.html',
  styleUrls: ['./proposal-request-package.component.scss']
})
export class ProposalRequestPackageComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  packages: PackageModel[] = [];

  constructor(private dialogRef: MatDialogRef<ProposalRequestPackageComponent>,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private requestPackageService: RequestPackageService,
              @Inject(MAT_DIALOG_DATA) public data: PackageModel) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [null, [Validators.required]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  get dateValue(): Date | undefined {
    return this.form.get('date').value;
  }

  updateDate(value: Date): void {
    const control = new FormControl(value);
    const error = dateBeforeNow(control);

    if (error !== null) {
      this.form.get('date').setValue(null);
      this.toastrService.warning('La fecha debe de ser igual o mayor a la actual', 'Validación');
      return;
    }

    this.requestPackageService.findAllByDateAndOffice(this.data.officeId, getDateFormat(value))
      .subscribe(packages => {
        this.packages = packages;
        this.form.get('date').setValue(value);
      });
  }

  save(): void {
    if (this.form.invalid) {
      this.toastrService.warning('Debe seleccionar una fecha del calendario','Validación');
      return;
    }

    const { date } = this.form.getRawValue();
    const data: ProposalRequestModel = <ProposalRequestModel>{
      requestId: this.data.requestId,
      startDate: getDateFormat(date)
    };
    this.requestPackageService.proposalRequest(data).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
