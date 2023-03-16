import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Lookup } from "../../../core/interfaces/lookup";
import { PerDiemModel } from "../../../core/models/per-diem.model";
import { isNil } from "../../utils/isNil";
import { StatusCarRequestLookup } from "../../../core/enums/lookups/status-car-request.lookup";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../utils/form-error";
import { PerDiemService } from "../../../core/services/per-diem.service";
import { sizeFile } from "../../utils/form-validations";
import { Observable, switchMap } from "rxjs";
import { StatusDriverRequestLookup } from "../../../core/enums/lookups/status-driver-request.lookup";
import { TypeLookup } from "../../../core/enums/type-lookup";

@Component({
  selector: 'app-per-diem',
  templateUrl: './per-diem.component.html',
  styleUrls: ['./per-diem.component.scss']
})
export class PerDiemComponent implements OnInit {
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
    private perDiemService: PerDiemService
  ) { }

  ngOnInit(): void {
    if (this.enableFirstSubmit) {
      this.form = this.fb.group({
        gasoline: [null, [Validators.required, Validators.min(1), Validators.max(999999)]],
        tollbooths: [null, [Validators.required, Validators.min(0), Validators.max(999999)]],
        food: [null, [Validators.required, Validators.min(0), Validators.max(999999)]],
        billFile: [null],
        billFileSrc: [null],
        spent: [null]
      });

      this.form.get('billFile').disable();
      this.form.get('spent').disable();

    } else if (this.enableSecondSubmit) {
      this.form = this.fb.group({
        billFile: [null, Validators.required],
        billFileSrc: [null, sizeFile(5000000)],
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
    return (
        isNil(this.perDiem?.gasoline) &&
        isNil(this.perDiem?.tollbooths) &&
        isNil(this.perDiem?.food) &&
        isNil(this.perDiem?.billFilename) &&
        isNil(this.perDiem?.spent)
      )
      && this.isRecepcionist
      && (
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
        isNil(this.perDiem?.billFilename) &&
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
    return !isNil(this.perDiem?.billFilename) && !isNil(this.perDiem?.spent);
  }

  get disableSaveButton(): boolean {
    if (this.enableFirstSubmit) {
      return false;
    }

    return !this.enableSecondSubmit;
  }

  changeBillZipFile(file: File): void {
    this.form.patchValue({
      billFileSrc: file
    });
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
      data = <PerDiemModel> {
        spent: formValues.spent
      };

      request$ = this.perDiemService.updateSpent(this.requestId, data).pipe(
        switchMap(() => this.perDiemService.updateImage(this.requestId, formValues.billFileSrc))
      );
    }

    request$.subscribe(() => {
      this.submitForm.emit(true);
    });
  }
}
