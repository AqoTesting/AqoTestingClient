import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed',
})
export class ToFixedPipe implements PipeTransform {
  transform(value: number, fixed: number): number {
    return +value.toFixed(fixed);
  }
}
