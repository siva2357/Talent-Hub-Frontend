export const RegexPatterns = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  NUMBER_ONLY: /^[0-9]+$/,
  ALPHABET_ONLY: /^[a-zA-Z\s]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  URL: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-z]{2,}(:\d{1,5})?(\/.*)?$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  LINKEDIN: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
  TWITTER: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
  GITHUB: /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
  DRIBBBLE: /^(https?:\/\/)?(www\.)?dribbble\.com\/[a-zA-Z0-9_-]+\/?$/,
  BEHANCE: /^(https?:\/\/)?(www\.)?behance\.net\/[a-zA-Z0-9_-]+\/?$/,

  BANK_ACCOUNT_NUMBER: /^[0-9]{9,18}$/,
  IFSC_CODE: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  PAN_CARD: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  AADHAAR_NUMBER: /^[0-9]{12}$/,
  ACCOUNT_HOLDER_NAME: /^[A-Za-z\s]{3,100}$/,
  BANK_NAME: /^[A-Za-z\s&().,-]{2,100}$/
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
