import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { RequestCarModel } from "../../../../core/models/request-car.model";
import { isNil } from "../../../../shared/utils/isNil";
import { RequestCarService } from "../../../../core/services/request-car.service";
import { Observable, switchMap } from "rxjs";
import { StatusCarRequestLookup } from "../../../../core/enums/lookups/status-car-request.lookup";
import {
  UploadMultipleFilesComponent
} from "../../../../shared/components/upload-multiple-files/upload-multiple-files.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-extra-information-request-car',
  templateUrl: './extra-information-request-car.component.html',
  styleUrls: ['./extra-information-request-car.component.scss']
})
export class ExtraInformationRequestCarComponent implements OnInit {
  @ViewChild('uploadMultipleFilesComponent')
  uploadMultipleFileComponent: UploadMultipleFilesComponent;

  @Input()
  requestCar: RequestCarModel;

  @Output()
  submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup;
  formErrors: FormErrors;

  constructor(
    private fb: FormBuilder,
    private requestCarService: RequestCarService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.enableFirstSubmit) {
      this.form = this.fb.group({
        initialKm: [null, [Validators.required, Validators.min(1), Validators.max(999999)]],
        finalKm: [null],
        deliveryCondition: [null]
      });

      this.form.get('finalKm').disable();
      this.form.get('deliveryCondition').disable();

    } else if (this.enableSecondSubmit) {
      this.form = this.fb.group({
        initialKm: [null],
        finalKm: [null, [Validators.required, Validators.min(1), Validators.max(999999)]],
        deliveryCondition: [null, [Validators.required, Validators.maxLength(2500)]]
      });
    } else {
      this.form = this.fb.group({});
    }

    this.formErrors = new FormErrors(this.form);
  }

  get enableSaveButton(): boolean {
    return this.enableFirstSubmit || this.enableSecondSubmit;
  }

  /**
   * Se habilitan los campos de archivo de responsiva, archivo ZIP para imágenes y kilometraje inicial
   */
  get enableFirstSubmit(): boolean {
    return this.requestCar.files.length === 0 || isNil(this.requestCar.initialKm);
  }

  /**
   * Se habilitan los campos de kilometraje final y comentarios de condiciones de entrega de vehículo
   */
  get enableSecondSubmit(): boolean {
    return (
      isNil(this.requestCar.finalKm) ||
      isNil(this.requestCar.deliveryCondition)
      ) &&
      (
        this.requestCar.files.length > 0 &&
        !isNil(this.requestCar.initialKm)
      ) &&
      this.requestCar.request.status.code === StatusCarRequestLookup[StatusCarRequestLookup.FINISHED];
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();

    const id = this.requestCar.id;
    let data: RequestCarModel;
    let request$: Observable<void>;

    if (this.enableFirstSubmit) {
      if (this.uploadMultipleFileComponent.files.length === 0) {
        this.toastrService.warning('Debe de agregar al menos una imagen');
        return;
      }

      data = <RequestCarModel> {
        initialKm: formValues.initialKm
      };

      request$ = this.requestCarService.addExtraCarInformation(id, data).pipe(
        switchMap(() => this.requestCarService.uploadImageFiles(id, this.uploadMultipleFileComponent.files))
      );
    } else if (this.enableSecondSubmit) {
      data = <RequestCarModel> {
        finalKm: formValues.finalKm,
        deliveryCondition: formValues.deliveryCondition
      };

      request$ = this.requestCarService.addExtraCarInformation(id, data);
    }

    request$.subscribe(() => {
      this.submitForm.emit(true);
    });
  }
}
