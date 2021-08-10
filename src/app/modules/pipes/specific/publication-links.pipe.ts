import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'publicationLinks',
})
export class PublicationLinksPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  references: any = /\[(\S+)\]/gi;

  transform(textFragment: string, localeStr: string) {
    return this.parseUrl(textFragment, localeStr);
  }

  private parseUrl(textFragment: string, localeStr: string) {
    let result = undefined;

    // Find/Replace reference links ([1, 2]) in text
    const words = textFragment.split(' ');
    const translation = this.translateService.instant(localeStr);

    words.forEach((word, i) => {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      if (word.match(this.references)) {
        console.log(word, ' matches!');
        const wrappedInLink = word.replace(
          this.references,
          '<a href="$1" class="link link--publication">%LINK%</a>'
        );

        words[i] = wrappedInLink.replace('%LINK%', translation);
      }
    });

    console.log(words);

    result = words.join(' ');

    if (result) {
      return result;
    }

    return textFragment;
  }
}
