import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'linkify',
})
export class LinkifyPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  references: any = /\[(\S+)\]/gi;

  transform(textFragment: string, localeStr: string) {
    return this.parseUrl(textFragment, localeStr);
  }

  private parseUrl(textFragment: string, localeStr: string) {
    let result = undefined;

    console.log(this.translateService.instant('link'));

    // Find/Replace reference links ([1, 2]) in text
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    if (textFragment.match(this.references)) {
      result = textFragment.replace(
        this.references,
        '<a href="$1" class="link link--publication">%LINK%</a>'
      );
      const translation = this.translateService.instant(localeStr);
      return result.replace('%LINK%', translation, '/g');
    }

    return textFragment;
  }
}
