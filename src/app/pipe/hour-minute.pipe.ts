import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourMinute',
})
export class HourMinutePipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    let minutes = value;
    if (minutes === null || minutes === undefined) {
      return null;
    }
    if (isNaN(minutes)) {
      return null;
    }
    if (minutes < 0) {
      return null;
    }
    // const hours = Math.floor(minutes / 3600);
    const hours = Math.floor(minutes / 60);
    // const minutes = Math.floor((secondes % 3600) / 60);
    minutes = minutes % 60;
    const hour = hours > 0 ? `${hours}h` : '';
    return `${hour}${minutes < 10 ? '0' : ''}${minutes}`; // Format as "XhYY"
  }
}
