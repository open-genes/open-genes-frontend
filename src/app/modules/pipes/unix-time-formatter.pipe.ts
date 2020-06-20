import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'unixTimeFormatter'
})

// tslint:disable-next-line:class-name
export class unixTimeFormatterPipe implements PipeTransform {
  constructor() {
  }

  transform(value: number): any {
    return new Date(value * 1000);
  }
}
