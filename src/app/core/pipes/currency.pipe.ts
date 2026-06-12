import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inr',
  standalone: true
})
export class InrCurrencyPipe implements PipeTransform {

  transform(
    value: number | string | null | undefined
  ): string {

    if (value === null || value === undefined || value === '') {
      return '₹0';
    }

    const amount = Number(value);

    if (isNaN(amount)) {
      return '₹0';
    }

    return `₹${amount.toLocaleString('en-IN')}`;
  }
}