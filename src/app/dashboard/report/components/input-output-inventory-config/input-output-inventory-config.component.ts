import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { dateAfterNow, endDateIsAfterToStartDate } from "../../../../shared/utils/form-validations";
import { Lookup } from "../../../../core/interfaces/lookup";
import { LookupService } from "../../../../core/services/lookup.service";
import { TypeLookup } from "../../../../core/enums/type-lookup";
import { Filters, TypesEnum } from "../../../../core/interfaces/filters";
import { downloadFile, getDateFormat } from "../../../../shared/utils/utils";
import { ReportService } from "../../../../core/services/report.service";
import { ToastrService } from "ngx-toastr";

interface FiltersReport {
  types: number[],
  startDate: Date;
  endDate: Date;
  format: 'pdf' | 'xlsx';
}

@Component({
  selector: 'app-input-output-inventory-config',
  templateUrl: './input-output-inventory-config.component.html',
  styleUrls: ['./input-output-inventory-config.component.scss']
})
export class InputOutputInventoryConfigComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  typeInventories: Lookup[] = [];
  filters: Filters = { filters: [] };

  constructor(private dialogRef: MatDialogRef<InputOutputInventoryConfigComponent>,
              private fb: FormBuilder,
              private lookupService: LookupService,
              private reportService: ReportService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      types: [null],
      startDate: [null, dateAfterNow],
      endDate: [null, dateAfterNow],
      format: ['pdf', Validators.required]
    }, {
      validators: [endDateIsAfterToStartDate('startDate', 'endDate')]
    });

    this.formErrors = new FormErrors(this.form);
    this.getTypeInventories();
  }

  generateReport(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valuesForm: FiltersReport = this.form.getRawValue();
    this.generateFilters(valuesForm);
    if (valuesForm.format === 'pdf') {
      this.reportService.reportInputOutputInventoryPdf(this.filters).subscribe(res => {
        downloadFile(res, 'entradas_salidas_inventario.pdf');
        this.toastrService.success('Archivo generado', 'Proceso exitoso');
        this.dialogRef.close();
      });
    } else if (valuesForm.format === 'xlsx') {
      this.reportService.reportInputOutputInventoryExcel(this.filters).subscribe(res => {
        downloadFile(res, 'entradas_salidas_inventario.xlsx');
        this.toastrService.success('Archivo generado', 'Proceso exitoso');
        this.dialogRef.close();
      });
    }
  }

  private getTypeInventories(): void {
    this.lookupService.findAllByType(TypeLookup.INVENTORY_TYPE).subscribe(data => {
      this.typeInventories = data;
    });
  }

  private generateFilters(config: FiltersReport): void {
    if (config.types) {
      this.generateFilter('types', TypesEnum.Array, config.types);
    }
    if (config.startDate) {
      this.generateFilter('start_date', TypesEnum.Date, getDateFormat(config.startDate));
    }
    if (config.endDate) {
      this.generateFilter('end_date', TypesEnum.Date, getDateFormat(config.endDate));
    }
  }

  private generateFilter(field: string, type: TypesEnum, value: any): void {
    this.filters.filters.push({ field, type, value });
  }
}
