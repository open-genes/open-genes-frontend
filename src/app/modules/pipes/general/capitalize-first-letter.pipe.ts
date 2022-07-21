import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter',
})
export class CapitalizeFirstLetter implements PipeTransform {
  transform(word: string): string {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}
