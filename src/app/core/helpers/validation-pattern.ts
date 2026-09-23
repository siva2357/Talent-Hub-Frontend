export const ValidationPatterns = {
  // Only letters (uppercase and lowercase) and spaces
  textOnly: /^[a-zA-Z\s]+$/,
  
  // Letters and numbers only (and spaces)
  textAndNumber: /^[a-zA-Z0-9\s]+$/,
  
  // Text, numbers, and standard special characters
  textNumberSpecialChar: /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/,
  
  // Specific pattern requiring at least one uppercase and one lowercase letter
  capsAndSmall: /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-\s]+$/,

  // Strict password pattern (minimum 8 chars, at least one uppercase, one lowercase, one number, one special character)
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

