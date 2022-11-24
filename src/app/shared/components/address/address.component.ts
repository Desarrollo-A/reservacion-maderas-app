import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../utils/form-error";
import { LookupService } from "../../../core/services/lookup.service";
import { Lookup } from "../../../core/interfaces/lookup";
import { TypeLookup } from "../../../core/enums/type-lookup";
import { MatAccordion } from "@angular/material/expansion";

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

  @ViewChild(MatAccordion)
  accordion: MatAccordion;

  countries: Lookup[] = [];
  form: FormGroup;
  formErrors: FormErrors;

  constructor(private fb: FormBuilder,
              private lookupService: LookupService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      street: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      numExt: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      numInt: [null, [Validators.minLength(1), Validators.maxLength(50)]],
      suburb: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      postalCode: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      state: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      countryId: [null, Validators.required]
    });

    this.formErrors = new FormErrors(this.form);

    this.lookupService.findAllByType(TypeLookup.COUNTRY_ADDRESS).subscribe(countries => this.countries = countries);
  }

  isInvalidForm(): boolean {
    return this.form.invalid;
  }

  markAllAsTouched(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.accordion.openAll();
    }
  }

  clearData(): void {
    this.form.reset({}, { emitEvent: false });
    this.accordion.closeAll();
  }
}
