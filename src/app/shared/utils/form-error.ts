import { FormGroup } from "@angular/forms";

export class FormErrors {
  public form: FormGroup;

  constructor(form: FormGroup) {
    this.form = form;
  }

  public customError(field: string, error: string): boolean | undefined {
    return this.form.get(field)?.hasError(error) && this.form.get(field)?.touched;
  }

  public customErrorFile(field: string, error: string): boolean | undefined {
    return this.form.get(field)?.hasError(error);
  }

  public errorObject(field: string, error: string): any {
    return this.form.get(field)?.getError(error);
  }

  public maxNumber(field: string): number {
    return this.errorObject(field, 'max').max;
  }

  public minNumber(field: string): number {
    return this.errorObject(field, 'min').min;
  }

  public maxLengthNumber(field: string): number {
    return this.errorObject(field, 'maxlength').requiredLength;
  }

  public minLengthNumber(field: string): number {
    return this.errorObject(field, 'minlength').requiredLength;
  }
}
