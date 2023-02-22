import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { UserModel } from "../../../../core/models/user.model";
import { FormErrors } from "../../../../shared/utils/form-error";
import { trackById } from "../../../../shared/utils/track-by";
import { UserService } from "../../../../core/services/user.service";
import { OfficeService } from "../../../../core/services/office.service";
import { OfficeModel } from "../../../../core/models/office.model";
import { LookupService } from "../../../../core/services/lookup.service";
import { forkJoin } from "rxjs";
import { TypeLookup } from "../../../../core/enums/type-lookup";
import { Lookup } from "../../../../core/interfaces/lookup";

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;

  offices: OfficeModel[] = [];
  statusUser: Lookup[] = [];

  trackById = trackById;

  constructor(
    private dialogRef: MatDialogRef<UpdateUserComponent>,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private userService: UserService,
    private officeService: OfficeService,
    private lookupService: LookupService,
    @Inject(MAT_DIALOG_DATA) public data: UserModel
  ) { }

  ngOnInit(): void {
    this.loadData();

    this.form = this.fb.group({
      noEmployee: [this.data.noEmployee, [Validators.required, Validators.maxLength(50)]],
      fullName: [this.data.fullName, [Validators.required, Validators.maxLength(150)]],
      email: [this.data.email, [Validators.required, Validators.email, Validators.maxLength(150)]],
      personalPhone: [this.data.personalPhone, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      officePhone: [this.data.officePhone, [Validators.minLength(10), Validators.maxLength(10)]],
      position: [this.data.position, [Validators.required, Validators.maxLength(100)]],
      area: [this.data.area, [Validators.required, Validators.maxLength(100)]],
      officeId: [this.data.officeId, [Validators.required]],
      statusId: [this.data.statusId, [Validators.required]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    const data: UserModel = {
      ... formValues,
      id: this.data.id
    };

    this.userService.update(this.data.id, data).subscribe(() => {
      this.toastrService.success('Registro actualizado', 'Proceso exitoso');
      this.dialogRef.close(true);
    });
  }

  private loadData(): void {
    forkJoin([
      this.lookupService.findAllByType(TypeLookup.STATUS_USER),
      this.officeService.getAllOffices()
    ]).subscribe(([statusUser, offices]) => {
      this.statusUser = statusUser;
      this.offices = offices;
    });
  }
}
