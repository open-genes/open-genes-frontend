import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trueFalseNull',
})
export class TrueFalseNullPipe implements PipeTransform {
  transform(value: boolean | null): string {
    if (typeof value === 'boolean') {
      return value ? 'logic_true' : 'logic_false';
    }

    return 'logic_null';
  }
}
