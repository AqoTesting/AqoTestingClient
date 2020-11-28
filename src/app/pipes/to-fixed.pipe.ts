import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed',
})
export class ToFixedPipe implements PipeTransform {
  transform(value: number, fixed: number): number {
    if (value - Math.floor(value) == 0) return value;
    return +value.toFixed(fixed);
  }
}
