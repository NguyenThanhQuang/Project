export interface PasswordValidationResult {
  isValid: boolean;
  strength: number;
  checks: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecialChar: boolean;
  };
}

export const validatePassword = (
  password: string
): PasswordValidationResult => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = [
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  ].filter(Boolean).length;

  return {
    isValid:
      minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    strength,
    checks: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    },
  };
};
