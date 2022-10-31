import { AbstractControl } from "@angular/forms";
import { LabelButton } from "../interfaces/label-button";
import { StatusRequestLookup } from "../../core/enums/lookups/status-request.lookup";

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

export const getLabelStatusRequest = (statusName: string, code: string): LabelButton => {
  if (code === StatusRequestLookup[StatusRequestLookup.NEW]) {
    return { text: statusName, textClass: 'text-blue', bgClass: 'bg-blue-light' };

  } else if (code === StatusRequestLookup[StatusRequestLookup.APPROVED]) {
    return { text: statusName, textClass: 'text-green', bgClass: 'bg-green-light' };

  } else if (code === StatusRequestLookup[StatusRequestLookup.REJECTED] ||
      code === StatusRequestLookup[StatusRequestLookup.CANCELLED]) {
    return { text: statusName, textClass: 'text-red', bgClass: 'bg-red-light' };

  } else if (code === StatusRequestLookup[StatusRequestLookup.PROPOSAL] ||
      code === StatusRequestLookup[StatusRequestLookup.IN_REVIEW]) {
    return { text: statusName, textClass: 'text-orange', bgClass: 'bg-orange-light' };

  } else if (code === StatusRequestLookup[StatusRequestLookup.WITHOUT_ATTENDING] ||
      code === StatusRequestLookup[StatusRequestLookup.EXPIRED]) {
    return { text: statusName, textClass: 'text-gray', bgClass: 'bg-gray-light' };

  } else if (code === StatusRequestLookup[StatusRequestLookup.FINISHED]) {
    return { text: statusName, textClass: 'text-teal', bgClass: 'bg-teal-light' };
  }
}

export const getDateFormat = (date: Date): string => date.toISOString().split('T')[0];

export const getTimeFormat = (date: Date): string => {
  return (date.getHours() < 10) ? `0${date.toLocaleTimeString()}` : date.toLocaleTimeString();
}

export const playNotificationAudio = (): void => {
  let audio = new Audio('../../../assets/audio/notification-song.mp3');
  audio.load();
  audio.play();
}

export const pathEventsRealtime = (className: string): string => {
  return `App\\Events\\${className}`;
}

export const downloadFile = (data: Blob, filename: string): void => {
  const fileUrl = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = fileUrl;
  a.target = '_blank';
  a.download = filename;
  a.click();
}
