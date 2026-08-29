import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number | string, currencyCode: string = 'INR', display: 'symbol' | 'code' = 'symbol'): string {
    if (value === null || value === undefined || value === '') return '';
    
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(amount)) return '';

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: display,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }
}
