import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'unixTimeFormatter'
})

export class UnixTimeFormatterPipe implements PipeTransform {
  constructor() {
  }

  transform(value: number): any {
    return new Date(value * 1000);
  }
}
