export enum SocialPlatform {
  LinkedIn = 'LinkedIn',
  Instagram = 'Instagram',
  Website = 'Website',
  Twitter = 'Twitter',
  GitHub = 'GitHub',
  Behance = 'Behance',
  Dribbble = 'Dribbble',
  Medium = 'Medium'
}

// URL regex validation
export const SOCIAL_URL_PATTERNS: Record<SocialPlatform, RegExp> = {
  [SocialPlatform.LinkedIn]: /^https:\/\/(www\.)?linkedin\.com\/.*$/i,
  [SocialPlatform.Instagram]: /^https:\/\/(www\.)?instagram\.com\/.*$/i,
  [SocialPlatform.Website]: /^https?:\/\/.*$/i,
  [SocialPlatform.Twitter]: /^https:\/\/(www\.)?twitter\.com\/.*$/i,
  [SocialPlatform.GitHub]: /^https:\/\/(www\.)?github\.com\/.*$/i,
  [SocialPlatform.Behance]: /^https:\/\/(www\.)?behance\.net\/.*$/i,
  [SocialPlatform.Dribbble]: /^https:\/\/(www\.)?dribbble\.com\/.*$/i,
  [SocialPlatform.Medium]: /^https:\/\/(www\.)?medium\.com\/.*$/i
};

// New mapping for Bootstrap Icons (CSS class names)
export const SOCIAL_ICONS: Record<SocialPlatform, string> = {
  [SocialPlatform.LinkedIn]: 'bi bi-linkedin',
  [SocialPlatform.Instagram]: 'bi bi-instagram',
  [SocialPlatform.Website]: 'bi bi-globe',
  [SocialPlatform.Twitter]: 'bi bi-twitter-x',
  [SocialPlatform.GitHub]: 'bi bi-github',
  [SocialPlatform.Behance]: 'bi bi-behance',
  [SocialPlatform.Dribbble]: 'bi bi-dribbble',
  [SocialPlatform.Medium]: 'bi bi-medium'
};
