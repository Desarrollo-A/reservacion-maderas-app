import { Component, OnInit } from '@angular/core';
import { Filters, TypesEnum } from 'src/app/core/interfaces/filters';
import { FormErrors } from 'src/app/shared/utils/form-error';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { dateAfterNow, endDateIsAfterToStartDate } from 'src/app/shared/utils/form-validations';
import { downloadFile, getDateFormat } from 'src/app/shared/utils/utils';
import { ReportService } from 'src/app/core/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

interface FiltersReport {
  startDate: Date;
  endDate: Date;
  format: 'pdf' | 'xlsx';
}

@Component({
  selector: 'app-package-config',
  templateUrl: './package-config.component.html',
  styleUrls: ['./package-config.component.scss']
})
export class PackageConfigComponent implements OnInit {

  form: FormGroup;
  formErrors: FormErrors;
  filters: Filters = { filters: [] };

  constructor(private dialogRef: MatDialogRef<PackageConfigComponent>,
              private fb: FormBuilder,
              private reportService: ReportService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      startDate: [null, dateAfterNow],
      endDate: [null, dateAfterNow],
      format: ['pdf', Validators.required]
    }, {
      validators: [endDateIsAfterToStartDate('startDate', 'endDate')]
    });

    this.formErrors = new FormErrors(this.form);
  }

  generateReport(): void{
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const valuesForm: FiltersReport = this.form.getRawValue();
    this.generateFilters(valuesForm);

    if (valuesForm.format === 'pdf') {
      this.reportService.reportRequestPackagePdf(this.filters).subscribe(res => {
        downloadFile(res, 'solicitudes_paqueteria_entregadas.pdf');
        this.toastrService.success('Archivo generado', 'Proceso exitoso');
        this.dialogRef.close();
      });
    } else if (valuesForm.format === 'xlsx') {
      this.reportService.reportRequestPackageExcel(this.filters).subscribe(res => {
        downloadFile(res, 'solicitudes_paqueteria_entregadas.xlsx');
        this.toastrService.success('Archivo generado', 'Proceso exitoso');
        this.dialogRef.close();
      });
    }
  }

  private generateFilters(config: FiltersReport): void {
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
