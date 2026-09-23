import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
    if (!value) return '';
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {};
    
    switch (format) {
      case 'short':
        options.day = '2-digit';
        options.month = '2-digit';
        options.year = '2-digit';
        break;
      case 'long':
        options.day = '2-digit';
        options.month = 'long';
        options.year = 'numeric';
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      case 'medium':
      default:
        options.day = '2-digit';
        options.month = 'short';
        options.year = 'numeric';
        break;
    }

    return new Intl.DateTimeFormat('en-IN', options).format(date);
  }
}
