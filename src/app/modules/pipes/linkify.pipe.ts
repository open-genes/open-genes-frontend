import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {
  references: any = /(\[\w])/ig;

  transform(text: string) {
    return this.parseUrl(text);
  }

  private parseUrl(text: string) {
    // Find/Replace reference links ([1, 2]) in text
    if (text.match(this.references)) {
      text = text.replace(this.references, '<a class="link link--anchor">$1</a>');
    }

    return text;
  }
}
