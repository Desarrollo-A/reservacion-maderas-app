import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { sizeFile } from "../../../../shared/utils/form-validations";
import { RequestCarModel } from "../../../../core/models/request-car.model";
import { isNil } from "../../../../shared/utils/isNil";
import { RequestCarService } from "../../../../core/services/request-car.service";
import { Observable, switchMap } from "rxjs";

@Component({
  selector: 'app-extra-information-request-car',
  templateUrl: './extra-information-request-car.component.html',
  styleUrls: ['./extra-information-request-car.component.scss']
})
export class ExtraInformationRequestCarComponent implements OnInit {
  @Input()
  requestCar: RequestCarModel;

  @Output()
  submitForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup;
  formErrors: FormErrors;

  constructor(private fb: FormBuilder,
              private requestCarService: RequestCarService) { }

  ngOnInit(): void {
    if (this.enableFirstSubmit) {
      this.form = this.fb.group({
        imageZipFile: [null, Validators.required],
        imageZipFileSrc: [null, sizeFile(5000000)],
        responsiveFile: [null, Validators.required],
        responsiveFileSrc: [null, sizeFile(2000000)],
        initialKm: [null, [Validators.required, Validators.min(1), Validators.max(999999)]],
        finalKm: [null],
        deliveryCondition: [null]
      });

      this.form.get('finalKm').disable();
      this.form.get('deliveryCondition').disable();

    } else if (this.enableSecondSubmit) {
      this.form = this.fb.group({
        imageZipFile: [null],
        imageZipFileSrc: [null],
        responsiveFile: [null],
        responsiveFileSrc: [null],
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
    return isNil(this.requestCar.imageZip) || isNil(this.requestCar.responsiveFilename) || isNil(this.requestCar.initialKm);
  }

  /**
   * Se habilitan los campos de kilometraje final y comentarios de condiciones de entrega de vehículo
   */
  get enableSecondSubmit(): boolean {
    return (isNil(this.requestCar.finalKm) || isNil(this.requestCar.deliveryCondition) &&
      (!isNil(this.requestCar.imageZip) && !isNil(this.requestCar.responsiveFilename) && !isNil(this.requestCar.initialKm)));
  }

  changeImageZipFile(file: File): void {
    this.form.patchValue({
      imageZipFileSrc: file
    });
  }

  changeResponsiveFile(file: File): void {
    this.form.patchValue({
      responsiveFileSrc: file
    });
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
      data = <RequestCarModel> {
        initialKm: formValues.initialKm
      };

      request$ = this.requestCarService.addExtraCarInformation(id, data).pipe(
        switchMap(() => this.requestCarService.uploadResponsiveFile(id, formValues.responsiveFileSrc)),
        switchMap(() => this.requestCarService.uploadZipImages(id, formValues.imageZipFileSrc))
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
