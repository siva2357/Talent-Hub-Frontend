import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SocialPlatform } from '../enums/socialMedia.enum';


/**
 * Platform-specific URL patterns
 */
export const SOCIAL_URL_PATTERNS: Record<SocialPlatform, RegExp> = {
  [SocialPlatform.LinkedIn]: /^https:\/\/(www\.)?linkedin\.com\/.*$/i,
  [SocialPlatform.GitHub]: /^https:\/\/(www\.)?github\.com\/.*$/i,
  [SocialPlatform.Website]: /^https?:\/\/.+$/i,
  [SocialPlatform.Twitter]: /^https:\/\/(www\.)?(twitter\.com|x\.com)\/.*$/i,
  [SocialPlatform.Instagram]: /^https:\/\/(www\.)?instagram\.com\/.*$/i,
  [SocialPlatform.Dribbble]: /^https:\/\/(www\.)?dribbble\.com\/.*$/i,
  [SocialPlatform.Behance]: /^https:\/\/(www\.)?behance\.net\/.*$/i,
  [SocialPlatform.Medium]: /^https:\/\/(www\.)?medium\.com\/.*$/i
};

/**
 * Cross-field validator for social profile
 */
export function socialProfileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const platform = control.get('platform')?.value as SocialPlatform;
    const link = control.get('link')?.value as string;

    if (!platform || !link) return null;

    const pattern = SOCIAL_URL_PATTERNS[platform];

    if (!pattern?.test(link)) {
      return { invalidUrl: true };
    }

    return null;
  };
}
