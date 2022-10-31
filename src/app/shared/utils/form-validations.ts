import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";
import { startOfDay } from "date-fns";
import { removeError } from "./utils";

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
    removeError(formGroup.get(confirmPassword), 'differentPassword');
    return null;
  }
}

export const endDateIsAfterToStartDate = (startDate: string, endDate: string) => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startDateValue = new Date(formGroup.get(startDate)?.value);
    const endDateValue = new Date(formGroup.get(endDate)?.value);

    if (startDateValue.getTime() > endDateValue.getTime()) {
      const error = { dateAfter: true };
      formGroup.get(endDate)?.setErrors(error);
      return error;
    }

    removeError(formGroup.get(endDate), 'dateAfter');
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

export const dateAfterNow = (control: FormControl): ValidationErrors | null => {
  if (control.value) {
    const today = startOfDay(new Date());
    const value = control.value;

    if (today < value) {
      return { dateAfterNow: true };
    }
  }

  return null;
}

export const workingHours = (control: FormControl): ValidationErrors | null => {
  if (control.value) {
    const timeParts = control.value.split(':');
    const hour = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    if (hour < START_WORKING_HOUR || (hour === FINISH_WORKING_HOUR && minutes === 30) || hour > FINISH_WORKING_HOUR) {
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


