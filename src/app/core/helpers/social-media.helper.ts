import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const PLATFORM_DOMAINS: Record<string, RegExp> = {
  LinkedIn: /linkedin\.com/i,
  GitHub: /github\.com/i,
  Portfolio: /.*/,          // allow any valid URL
  'Twitter / X': /(twitter\.com|x\.com)/i,
  Instagram: /instagram\.com/i,
  Facebook: /facebook\.com/i,
  Dribbble: /dribbble\.com/i,
  Behance: /behance\.net/i
};

export function socialProfileValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const platform = group.get('platform')?.value;
    const link = group.get('link')?.value;

    if (!platform || !link) return null;

    // basic URL check
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(link)) {
      return { invalidUrl: true };
    }

    const domainPattern = PLATFORM_DOMAINS[platform];
    if (domainPattern && !domainPattern.test(link)) {
      return { platformMismatch: true };
    }

    return null;
  };
}
