import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripTags'
})
export class StripTagsPipe implements PipeTransform {
  transform(value: string): any {
    return value
      .replace(/&#{0,1}[a-z0-9]+;/gmi, '')                    // Замена html entities
      .replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')   // Замена html-тегов
      .replace(/^\[/gmi, '')                                  // Замена открывающей [
      .replace(/\].$/gmi, '.');                               // Замена закрывающей ]
  }
}
