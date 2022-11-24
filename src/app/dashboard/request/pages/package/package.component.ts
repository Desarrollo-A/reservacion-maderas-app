import { Component, OnInit, ViewChild } from '@angular/core';
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { StateModel } from "../../../../core/models/state.model";
import { OfficeModel } from "../../../../core/models/office.model";
import { trackById } from "../../../../shared/utils/track-by";
import { ToastrService } from "ngx-toastr";
import { StateService } from "../../../../core/services/state.service";
import { dateAfter30Days, dateBeforeNow, sizeFile } from "../../../../shared/utils/form-validations";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { switchMap, tap } from "rxjs";
import { OfficeService } from "../../../../core/services/office.service";
import { AddressComponent } from "../../../../shared/components/address/address.component";
import { RequestPackageService } from "../../../../core/services/request-package.service";
import { PackageModel } from "../../../../core/models/package.model";
import { AddressModel } from "../../../../core/models/address.model";
import { RequestModel } from "../../../../core/models/request.model";
import { getDateFormat } from "../../../../shared/utils/utils";

@UntilDestroy()
@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class PackageComponent implements OnInit {
  @ViewChild('pickupAddress')
  pickupAddressComponent: AddressComponent;
  @ViewChild('arrivalAddress')
  arrivalAddressComponent: AddressComponent;

  form: FormGroup;
  formErrors: FormErrors;

  states: StateModel[] = [];
  offices: OfficeModel[] = [];

  trackById = trackById;

  constructor(private fb: FormBuilder,
              private stateService: StateService,
              private officeService: OfficeService,
              private toastrService: ToastrService,
              private requestPackageService: RequestPackageService) {}

  ngOnInit(): void {
    this.getAllStates();

    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      state: [null, Validators.required],
      officeId: [null, Validators.required],
      date: [null, [Validators.required, dateBeforeNow, dateAfter30Days]],
      addGoogleCalendar: [false],
      nameReceive: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      emailReceive: [null, [Validators.required, Validators.email, Validators.maxLength(150)]],
      comment: [null, Validators.maxLength(2500)],
      authorizationFile: [null, [Validators.required, sizeFile(3072)]]
    });

    this.formErrors = new FormErrors(this.form);

    this.form.get('state')?.valueChanges.pipe(
      untilDestroyed(this),
      tap(() => this.form.get('officeId')?.reset()),
      switchMap(state => this.officeService.getOfficeByStateWithDriver(state))
    ).subscribe(offices => {
      if (offices.length === 0) {
        this.toastrService.info('No hay oficinas con choferes en esta sede', 'Información');
      }
      this.offices = offices;
    });
  }

  changeFile(file: File): void {
    this.form.patchValue({
      authorizationFile: file
    });
  }

  save(): void {
    if (this.form.invalid || this.pickupAddressComponent.isInvalidForm() || this.arrivalAddressComponent.isInvalidForm()) {
      this.form.markAllAsTouched();
      this.pickupAddressComponent.markAllAsTouched();
      this.arrivalAddressComponent.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    const pickupAddress: AddressModel = this.pickupAddressComponent.form.value;
    const arrivalAddress: AddressModel = this.arrivalAddressComponent.form.value;
    const packageModel: PackageModel = <PackageModel> {
      pickupAddress,
      arrivalAddress,
      nameReceive: formValues.nameReceive,
      emailReceive: formValues.emailReceive,
      officeId: formValues.officeId,
    };
    const request: RequestModel = <RequestModel> {
      title: formValues.title,
      startDate: getDateFormat(formValues.date),
      comment: formValues.comment,
      addGoogleCalendar: formValues.addGoogleCalendar,
      package: packageModel
    };

    this.requestPackageService.store(request).pipe(
      switchMap(res => this.requestPackageService.uploadFile(res.id, formValues.authorizationFile))
    )
      .subscribe(() => {
        this.form.reset({}, { emitEvent: false });
        this.pickupAddressComponent.clearData();
        this.arrivalAddressComponent.clearData();

        this.toastrService.success('Solicitud creada', 'Proceso existoso');
      });
  }

  private getAllStates(): void {
    this.stateService.findAll().subscribe(states => {
      this.states = states;
    });
  }
}
