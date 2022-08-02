import { AbstractControl } from "@angular/forms";

export const convertCamelCaseToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export const roundedTime = (time: string, minutesToRound: number = 30): string => {
  const timeParts = time.split(':');
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  const allTime = (hours * 60) + minutes;

  const rounded = Math.round(allTime / minutesToRound) * minutesToRound;
  const rHr = `${Math.floor(rounded / 60)}`;
  const rMin = `${rounded % 60}`;

  return `${rHr.padStart(2, '0')}:${rMin.padStart(2, '0')}`;
}

export const compareTimes = (startTime: string, endTime: string): boolean => {
  const [startHours, startMinutes] = startTime.split(':');
  const [endHours, endMinutes] = endTime.split(':');

  const startAllMinutes = (parseInt(startHours) * 60) + parseInt(startMinutes);
  const endAllMinutes = (parseInt(endHours) * 60) + parseInt(endMinutes);

  return (startAllMinutes >= endAllMinutes);
}

export const removeError = (control: AbstractControl, error: string): void => {
  const err = control.errors;
  if (err) {
    delete err[error];
    if (!Object.keys(err).length) {
      control.setErrors(null);
    } else {
      control.setErrors(err);
    }
  }
}

export const weekendsOffCalendar = (d: Date | null): boolean => {
  if (d) {
    const day = d.getDay();

    return day !== 0 && day !== 6;
  }
}
