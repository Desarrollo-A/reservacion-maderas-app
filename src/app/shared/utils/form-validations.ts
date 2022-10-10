import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";
import { startOfDay } from "date-fns";

const START_WORKING_HOUR = 8;
const FINISH_WORKING_HOUR = 18;
const SIZE_IMAGE = 2097152;

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

export const sizeImage = (control: FormControl): ValidationErrors | null => {
  if (control.value) {
    const file: File = control.value;

    if (file.size > SIZE_IMAGE) {
      return { imageSize: true };
    }
  }

  return null;
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
    const minutes = parseInt(timeParts[1]);

    if (hour < START_WORKING_HOUR || (hour >= FINISH_WORKING_HOUR && minutes > 0)) {
      return { outOfTime: true };
    }
  }

  return null;
}

export const greaterThanCero = (control: FormControl): ValidationErrors | null => {
  if (control.value != null) {
    if (control.value <= 0) {
      return { greaterThanCero: true };
    }
  }

  return null;
}


