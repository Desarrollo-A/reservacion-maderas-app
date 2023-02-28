import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../utils/form-error";
import { LookupService } from "../../../core/services/lookup.service";
import { Lookup } from "../../../core/interfaces/lookup";
import { TypeLookup } from "../../../core/enums/type-lookup";
import { MatAccordion } from "@angular/material/expansion";
import { AddressModel } from "../../../core/models/address.model";
import { OfficeModel } from 'src/app/core/models/office.model';
import { trackById } from '../../utils/track-by';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input()
  title = '';
  @Input()
  subtitle = '';
  @Input()
  enableForm = true;
  @Input()
  data: AddressModel;
  @Input()
  officeName?: string;
  @Input()
  set offices(data:OfficeModel[]){
    this.dataOffices = data;
  }

  @ViewChild(MatAccordion)
  accordion: MatAccordion;

  /**
   * Variable para el almacenamiento de
   * las officinas traidas desde el padre
   * y plasmadas en el componente address
   */
  dataOffices: OfficeModel[];
  countries: Lookup[] = [];

  form: FormGroup;
  formAddressInternal: FormGroup;
  isExternalControl = new FormControl<boolean>(false);

  formErrors: FormErrors;
  formErrorsAddressInternal: FormErrors;

  trackById = trackById;
  constructor(private fb: FormBuilder,
              private lookupService: LookupService) {}

  ngOnInit(): void {
    if (this.enableForm) {
      this.form = this.fb.group({
        street: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
        numExt: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        numInt: [null, [Validators.minLength(1), Validators.maxLength(50)]],
        suburb: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        postalCode: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
        state: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        countryId: [null, [Validators.required]],
      });
      this.formErrors = new FormErrors(this.form);
      this.lookupService.findAllByType(TypeLookup.COUNTRY_ADDRESS).subscribe(countries => this.countries = countries);

      this.formAddressInternal = this.fb.group({
        officeAddressId: [null, Validators.required],
      });
      this.formErrorsAddressInternal = new FormErrors(this.formAddressInternal);
    }
  }

  get isExternal(): boolean{
    return this.isExternalControl.value;
  }

  get office(): string {
    return this.data.office?.name ?? this.officeName ?? '';
  }

  isAddressExternal(checked: boolean){
    (!checked) ? this.form.reset() : this.formAddressInternal.reset();
  }

  isInvalidForm(): boolean {
    return (this.isExternal) ? this.form.invalid : this.formAddressInternal.invalid;
  }

  markAllAsTouched(): void {
    if(this.isExternal){
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.accordion.openAll();
      }
    }else if (this.formAddressInternal.invalid){
        this.formAddressInternal.markAllAsTouched();
        this.accordion.openAll();
    }
  }

  clearData(): void {
    this.form.reset({}, { emitEvent: false });
    this.formAddressInternal.reset({}, { emitEvent: false });
    this.isExternalControl.setValue(false);
    this.accordion.closeAll();
  }
}
