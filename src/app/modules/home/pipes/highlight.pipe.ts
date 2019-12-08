import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})

export class HighlightSearch implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }

    return value.replace(new RegExp(args, 'gi'), match => {
      return '<mark>' + match + '</mark>';
    });
  }
}
