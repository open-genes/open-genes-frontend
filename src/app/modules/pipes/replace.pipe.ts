import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, regexValue: string, replaceValue: string): any {
    const formattedValue = value.toString();
    const regex = new RegExp(regexValue, 'g');
    return formattedValue.replace(regex, replaceValue);
  }
}
