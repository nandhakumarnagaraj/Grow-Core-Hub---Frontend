import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const hasNumber = /[0-9]/.test(control.value);
      const hasUpper = /[A-Z]/.test(control.value);
      const hasLower = /[a-z]/.test(control.value);
      const hasSpecial = /[#?!@$%^&*-]/.test(control.value);
      const isLengthValid = control.value.length >= 8;

      const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isLengthValid;

      return passwordValid ? null : { passwordStrength: true };
    };
  }

  static emailDomain(allowedDomains: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const email = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1);

      return allowedDomains.includes(domain) ? null : { emailDomain: true };
    };
  }

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(control.value) ? null : { phoneNumber: true };
    };
  }

  static noWhitespaceOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespaceOnly: true } : null;
    };
  }
}
