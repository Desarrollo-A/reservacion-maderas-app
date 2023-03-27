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
import { dateAfter30Days, dateBeforeNow } from "../../../../shared/utils/form-validations";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { forkJoin, switchMap, tap } from "rxjs";
import { OfficeService } from "../../../../core/services/office.service";
import { AddressComponent } from "../../../../shared/components/address/address.component";
import { RequestPackageService } from "../../../../core/services/request-package.service";
import { PackageModel } from "../../../../core/models/package.model";
import { AddressModel } from "../../../../core/models/address.model";
import { RequestModel } from "../../../../core/models/request.model";
import { getDateFormat } from "../../../../shared/utils/utils";
import { LookupService } from "../../../../core/services/lookup.service";
import { HeavyShippingLookup } from "../../../../core/enums/lookups/heavy-shipping.lookup";
import { TypeLookup } from "../../../../core/enums/type-lookup";
import { Lookup } from "../../../../core/interfaces/lookup";
import { HeavyShipmentTableComponent } from "../../components/heavy-shipment-table/heavy-shipment-table.component";

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
  @ViewChild('heavyShipmentTableComponent')
  heavyShipmentTableComponent: HeavyShipmentTableComponent;

  form: FormGroup;
  formErrors: FormErrors;

  states: StateModel[] = [];
  offices: OfficeModel[] = [];
  allOffices: OfficeModel[] = [];
  heavyShipping: Lookup;

  trackById = trackById;

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private officeService: OfficeService,
    private toastrService: ToastrService,
    private requestPackageService: RequestPackageService,
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.getAllStatesAndOffices();

    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      state: [null, Validators.required],
      officeId: [null, Validators.required],
      date: [null, [Validators.required, dateBeforeNow, dateAfter30Days]],
      addGoogleCalendar: [false],
      nameReceive: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      emailReceive: [null, [Validators.required, Validators.email, Validators.maxLength(150)]],
      comment: [null,  [Validators.required, Validators.maxLength(2500)]],
      isUrgent: [false],
      isHeavyShipping: [false]
    });
    this.formErrors = new FormErrors(this.form);

    this.form.get('state')?.valueChanges.pipe(
      untilDestroyed(this),
      tap(() => this.form.get('officeId')?.reset()),
      switchMap(state => this.officeService.getOfficeByStateId(state))
    ).subscribe(offices => {
      if (offices.length === 0) {
        this.toastrService.info('No hay oficinas disponibles', 'Información');
      }
      this.offices = offices;
    });
  }

  get isHeavyShipping(): boolean {
    return this.form.get('isHeavyShipping').value;
  }

  save(): void {
    if (this.form.invalid || this.pickupAddressComponent.isInvalidForm() || this.arrivalAddressComponent.isInvalidForm()) {
      this.form.markAllAsTouched();
      this.pickupAddressComponent.markAllAsTouched();
      this.arrivalAddressComponent.markAllAsTouched();
      return;
    }

    if (this.heavyShipmentTableComponent?.heavyshipments.length === 0) {
      this.toastrService.warning('Debe agregar al menos un artículo', 'Validación');
      return;
    }

    const formValues = this.form.getRawValue();

    const pickupAddress: AddressModel = {
      ...this.pickupAddressComponent.form.value,
      isExternal: this.pickupAddressComponent.isExternalControl.value
    };

    const arrivalAddress: AddressModel =  {
      ...this.arrivalAddressComponent.form.value,
      isExternal: this.arrivalAddressComponent.isExternalControl.value
    };

    const packageModel: PackageModel = <PackageModel> {
      pickupAddress,
      arrivalAddress,
      pickupAddressId: this.pickupAddressComponent.formAddressInternal.value.officeAddressId,
      arrivalAddressId: this.arrivalAddressComponent.formAddressInternal.value.officeAddressId,
      nameReceive: formValues.nameReceive,
      emailReceive: formValues.emailReceive,
      officeId: formValues.officeId,
      isUrgent: formValues.isUrgent,
      isHeavyShipping: formValues.isHeavyShipping,
      heavyShipments: this.heavyShipmentTableComponent?.heavyshipments ?? []
    };

    const request: RequestModel = <RequestModel> {
      title: formValues.title,
      startDate: getDateFormat(formValues.date),
      comment: formValues.comment,
      addGoogleCalendar: formValues.addGoogleCalendar,
      package: packageModel
    };

    this.requestPackageService.store(request).subscribe(() => {
      this.form.reset({
        addGoogleCalendar: false,
        isUrgent: false,
        isHeavyShipment: false
      }, { emitEvent: false });

      this.pickupAddressComponent.clearData();
      this.arrivalAddressComponent.clearData();

      this.toastrService.success('Solicitud creada', 'Proceso existoso');
    });
  }

  private getAllStatesAndOffices(): void {
    forkJoin([
      this.stateService.findAll(),
      this.officeService.getAllOffices(),
      this.lookupService.findByCodeAndType(HeavyShippingLookup[HeavyShippingLookup.NUMBER], TypeLookup.HEAVY_SHIPPING)
    ])
      .subscribe(([states, offices, lookup]) => {
        this.states = states;
        this.allOffices = offices;
        this.heavyShipping = lookup;
      });
  }
}
