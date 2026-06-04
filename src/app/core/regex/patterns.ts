export const RegexPatterns = {
  // Standard Email Regex
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Numeric characters only
  NUMBER_ONLY: /^[0-9]+$/,

  // Alphabetical characters only (allows spaces)
  ALPHABET_ONLY: /^[a-zA-Z\s]+$/,

  // Alphanumeric characters only (allows spaces)
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,

  // Strong Password requirement: Min 8 chars, at least one uppercase, one lowercase, one number, and one special character
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // Phone Number Regex (supports optional leading plus and 7 to 15 digits)
  PHONE: /^\+?[1-9]\d{1,14}$/,

  // Standard URL format
  URL: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-z]{2,}(:\d{1,5})?(\/.*)?$/,

  // Username validation (alphanumeric, underscores, hyphens, 3 to 20 characters)
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,

  // Platform-specific Social Media URL Patterns
  LINKEDIN: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
  TWITTER: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
  GITHUB: /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
  DRIBBBLE: /^(https?:\/\/)?(www\.)?dribbble\.com\/[a-zA-Z0-9_-]+\/?$/,
  BEHANCE: /^(https?:\/\/)?(www\.)?behance\.net\/[a-zA-Z0-9_-]+\/?$/
};

export function validateSocialLink(platform: string, url: string): boolean {
  if (!url) return false;
  
  const cleanUrl = url.trim();
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return RegexPatterns.LINKEDIN.test(cleanUrl);
    case 'twitter':
    case 'x':
      return RegexPatterns.TWITTER.test(cleanUrl);
    case 'github':
      return RegexPatterns.GITHUB.test(cleanUrl);
    case 'dribbble':
      return RegexPatterns.DRIBBBLE.test(cleanUrl);
    case 'behance':
      return RegexPatterns.BEHANCE.test(cleanUrl);
    case 'portfolio':
      return RegexPatterns.URL.test(cleanUrl);
    default:
      return RegexPatterns.URL.test(cleanUrl);
  }
}
