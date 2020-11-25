import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

export function cloneAbstractControl<T extends AbstractControl>(control: T): T {
  let newControl: T;

  if (control instanceof FormGroup) {
    const formGroup = new FormGroup(
      {},
      control.validator,
      control.asyncValidator
    );
    const controls = control.controls;

    Object.keys(controls).forEach((key) => {
      formGroup.addControl(key, cloneAbstractControl(controls[key]));
    });

    newControl = formGroup as any;
  } else if (control instanceof FormArray) {
    const formArray = new FormArray(
      [],
      control.validator,
      control.asyncValidator
    );

    control.controls.forEach((formControl) =>
      formArray.push(cloneAbstractControl(formControl))
    );

    newControl = formArray as any;
  } else if (control instanceof FormControl) {
    newControl = new FormControl(
      control.value,
      control.validator,
      control.asyncValidator
    ) as any;
  } else {
    throw new Error('Error: unexpected control value');
  }

  if (control.disabled) newControl.disable({ emitEvent: false });
  if (control.dirty) newControl.markAsDirty();

  return newControl;
}
