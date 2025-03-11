import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkBlankValue',
})
export class CheckBlankValuePipe implements PipeTransform {
  transform(value: string | number | any[], prepend = '', append = '', replacementValue = '—'): string {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return replacementValue;
    } else {
      return `${prepend}${value}${append}`;
    }
  }
}
