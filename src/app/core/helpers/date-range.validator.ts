import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('contractStartDate')?.value;
  const end = control.get('contractEndDate')?.value;
  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (endDate < startDate) {
    return { dateRangeInvalid: 'End date cannot be before start date' };
  }

  const minEndDate = new Date(startDate);
  minEndDate.setMonth(minEndDate.getMonth() + 3);
  
  const maxEndDate = new Date(startDate);
  maxEndDate.setMonth(maxEndDate.getMonth() + 6);

  if (endDate < minEndDate) {
    return { dateRangeInvalid: 'Contract duration must be at least 3 months' };
  }

  if (endDate > maxEndDate) {
    return { dateRangeInvalid: 'Contract duration cannot exceed 6 months' };
  }

  return null;
};
