import {DatePipe} from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(value: any, pattern: string = 'mediumDate'): any {
    const date = new Date(value);
    const datePipe: DatePipe = new DatePipe(this.translate.currentLang);
    return datePipe.transform(date, pattern);
  }
}
