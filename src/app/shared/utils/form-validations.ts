import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";
import { startOfDay } from "date-fns";

const START_WORKING_HOUR = 8;
const FINISH_WORKING_HOUR = 18;

export const comparePassword = (password: string, confirmPassword: string) => {
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

export const dateBeforeNow = (control: FormControl): ValidationErrors | null => {
  if (control.value) {
    const today = startOfDay(new Date());
    const value = control.value;

    if (today > value) {
      return { dateBeforeNow: true };
    }
  }

  return null;
}

export const workingHours = (control: FormControl): ValidationErrors | null => {
  if (control.value) {
    const timeParts = control.value.split(':');
    const hour = parseInt(timeParts[0]);

    if (hour < START_WORKING_HOUR || hour > FINISH_WORKING_HOUR) {
      return { outOfTime: true };
    }
  }

  return null;
}


