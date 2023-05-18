import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LookupService } from "../../../../core/services/lookup.service";
import { TypeLookup } from "../../../../core/enums/type-lookup";
import { Lookup } from "../../../../core/interfaces/lookup";
import { DriverModel } from "../../../../core/models/driver.model";
import { dayName } from "../../../../shared/utils/utils";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { DriverParcelDayModel } from "../../../../core/models/driver-parcel-day.model";
import { DriverService } from "../../../../core/services/driver.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-driver-parcel-days',
  templateUrl: './driver-parcel-days.component.html',
  styles: []
})
export class DriverParcelDaysComponent implements OnInit {
  form: FormGroup;

  dayName = dayName;

  constructor(
    private dialogRef: MatDialogRef<DriverParcelDaysComponent>,
    private lookupService: LookupService,
    private driverService: DriverService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public driver: DriverModel
  ) { }

  ngOnInit(): void {
    this.loadDays();

    this.form = this.fb.group({
      driverParcelDay: this.fb.array([])
    });
  }

  get driverParcelDay(): FormArray {
    return this.form.get('driverParcelDay') as FormArray;
  }

  save(): void {
    const formValues: { lookup: Lookup, checked: boolean }[] = this.form.getRawValue().driverParcelDay;
    const data: DriverParcelDayModel[] = formValues
      .filter(value => value.checked)
      .map(value => {
        let driverParcelDayModel = new DriverParcelDayModel();
        driverParcelDayModel.dayId = value.lookup.id;
        return driverParcelDayModel;
      });

    this.driverService.updateParcelDays(this.driver.id, data).subscribe(() => {
      this.toastrService.success('Información guardada correctamente', 'Proceso exitoso')
      this.dialogRef.close();
    });
  }

  private loadDays(): void {
    this.lookupService.findAllByType(TypeLookup.WEEK_DAYS).subscribe(lookups => {
      lookups.forEach(lookup => {
        const checked = this.isParcelDay(lookup.value);
        this.addFormGroup(lookup, checked);
      });
    });
  }

  private isParcelDay(day: string): boolean {
    return this.driver.driverParcelDays.some(d => d.day.value === day);
  }

  private addFormGroup(lookup: Lookup,  checked: boolean): void {
    const dayForm = this.fb.group({
      lookup,
      checked
    });

    this.driverParcelDay.push(dayForm);
  }
}
