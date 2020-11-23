import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

class RegExpValidator {
  static RegExpValidator(regex: RegExp, property: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!regex.test(control.value)) {
        return { [property]: true };
      }
      return null;
    };
  }
}

export default RegExpValidator.RegExpValidator;
