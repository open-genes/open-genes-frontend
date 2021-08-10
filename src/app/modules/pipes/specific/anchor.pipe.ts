import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'anchorLinks',
})
export class AnchorPipe implements PipeTransform {
  references: any = /(\[(\S)*])/gi;

  transform(text: string) {
    return this.parseUrl(text);
  }

  private parseUrl(text: string) {
    // Find/Replace reference links ([1, 2]) in text
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    if (text.match(this.references)) {
      text = text.replace(
        this.references,
        '<span class="link link--anchor">$1</span>'
      );
    }

    return text;
  }
}
