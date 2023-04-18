import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Lookup } from "../../../core/interfaces/lookup";
import { PerDiemModel } from "../../../core/models/per-diem.model";
import { isNil } from "../../utils/isNil";
import { StatusCarRequestLookup } from "../../../core/enums/lookups/status-car-request.lookup";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../utils/form-error";
import { PerDiemService } from "../../../core/services/per-diem.service";
import { Observable, switchMap } from "rxjs";
import { StatusDriverRequestLookup } from "../../../core/enums/lookups/status-driver-request.lookup";
import { TypeLookup } from "../../../core/enums/type-lookup";
import { UploadMultipleFilesComponent } from "../upload-multiple-files/upload-multiple-files.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-per-diem',
  templateUrl: './per-diem.component.html',
  styleUrls: ['./per-diem.component.scss']
})
export class PerDiemComponent implements OnInit {
  @ViewChild('uploadMultipleFilesComponent')
  uploadMultipleFileComponent: UploadMultipleFilesComponent;

  @Input()
  requestId: number;
  @Input()
  perDiem: PerDiemModel;
  @Input()
  isRecepcionist: boolean;
  @Input()
  isApplicant: boolean;
  @Input()
  set status(status: Lookup) {
    this._status = status;
  }

  @Output()
  submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _status: Lookup;

  form: FormGroup;
  formErrors: FormErrors;

  constructor(
    private fb: FormBuilder,
    private perDiemService: PerDiemService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.enableFirstSubmit) {
      this.form = this.fb.group({
        gasoline: [null, [
          Validators.required, Validators.min(1), Validators.max(999999)
        ]],
        tollbooths: [null, [Validators.required, Validators.min(0), Validators.max(999999)]],
        food: [null, [Validators.required, Validators.min(0), Validators.max(999999)]],
        spent: [null]
      });

    } else if (this.enableSecondSubmit) {
      this.form = this.fb.group({
        spent: [null, [Validators.required, Validators.min(1), Validators.max(999999)]]
      });

    } else {
      this.form = this.fb.group({});
    }

    this.formErrors = new FormErrors(this.form);
  }

  /**
   * Se habilitan los campos de gasolina, casetas de cobro y alimentos, además de que sea recepcionista
   */
  get enableFirstSubmit(): boolean {
    return !this.perDiem &&
      this.isRecepcionist &&
      (
        (this._status.type === TypeLookup.STATUS_CAR_REQUEST &&
          this._status.code === StatusCarRequestLookup[StatusCarRequestLookup.APPROVED]) ||
        (this._status.type === TypeLookup.STATUS_DRIVER_REQUEST &&
          this._status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.APPROVED])
      );
  }

  /**
   * Se habilita los campos de nombre del archivo y total gastado, además de que sea aplicante
   */
  get enableSecondSubmit(): boolean {
    return (
        this.perDiem?.files.length === 0 &&
        isNil(this.perDiem?.spent) &&
        !isNil(this.perDiem?.gasoline) &&
        !isNil(this.perDiem?.tollbooths) &&
        !isNil(this.perDiem?.food)
      )
      && this.isApplicant
      && (
        (this._status.type === TypeLookup.STATUS_CAR_REQUEST &&
          this._status.code === StatusCarRequestLookup[StatusCarRequestLookup.FINISHED]) ||
        (this._status.type === TypeLookup.STATUS_DRIVER_REQUEST &&
          this._status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.FINISHED])
      );
  }

  get showSecondSubmit(): boolean {
    return !isNil(this.perDiem?.spent) && this.perDiem.files.length > 0;
  }

  get disableSaveButton(): boolean {
    if (this.enableFirstSubmit) {
      return false;
    }

    return !this.enableSecondSubmit;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    let data: PerDiemModel;
    let request$: Observable<PerDiemModel | void>;

    if (this.enableFirstSubmit) {
      data = <PerDiemModel> {
        requestId: this.requestId,
        gasoline: formValues.gasoline,
        tollbooths: formValues.tollbooths,
        food: formValues.food
      };

      request$ = this.perDiemService.store(data);
    } else if (this.enableSecondSubmit) {
      if (this.uploadMultipleFileComponent.files.length === 0) {
        this.toastrService.warning('Debe de agregar al menos un archivo PDF o XML');
        return;
      }

      data = <PerDiemModel> {
        spent: formValues.spent
      };

      request$ = this.perDiemService.updateSpent(this.perDiem.id, data).pipe(
        switchMap(() => this.perDiemService.updateBillFiles(this.perDiem.id, this.uploadMultipleFileComponent.files))
      );
    }

    request$.subscribe(() => {
      this.submitForm.emit(true);
    });
  }
}
