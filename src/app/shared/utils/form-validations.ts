import { AbstractControl, ValidationErrors } from "@angular/forms";

export function comparePassword(password: string, confirmPassword: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const pass1 = formGroup.get(password)?.value;
    const pass2 = formGroup.get(confirmPassword)?.value;

    if (pass1 !== pass2) {
      let error = { differentPassword: true };
      formGroup.get(confirmPassword)?.setErrors(error);
      return error;
    }
    formGroup.get(confirmPassword)?.setErrors(null);
    return null;
  }
}
