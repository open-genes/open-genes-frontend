import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'publicationLinksWrap',
})
export class PublicationLinksWrapperPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  references = /\[(\S+)\]/gi;

  transform(wholeText: string, localeStr: string) {
    return this.parseUrl(wholeText, localeStr);
  }

  private parseUrl(wholeText: string, localeStr: string) {
    let result = undefined;
    let urlPrefix = '';
    // Find/Replace reference links ([10.5551/jat.41335]) in text
    const words = wholeText.split(' ');
    const translation = this.translateService.instant(localeStr);

    words.forEach((word, i) => {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      if (word.match(this.references)) {
        // Prepend URL by matching link format
        const isDOI = word.match(/10.\S*/g); // 10.1007/978-3-540-46129-6
        const isPMID = word.match(/\d*/g); // 23509288
        const isPMCID = word.match(/PMC\d*/g); // PMC3531190

        if (isDOI) {
          urlPrefix = `href="http://doi.org/`;
        } else if (isPMID) {
          urlPrefix = `href="https://pubmed.ncbi.nlm.nih.gov/`;
        } else if (isPMCID) {
          urlPrefix = `href="http://www.ncbi.nlm.nih.gov/pmc/?term=`;
        } else {
          urlPrefix = `href="http://`;
        }

        // Wrap link in HTML element
        const wrappedInLink = word.replace(
          this.references,
          '<a href="$1" class="link link--publication">%LINK%</a>'
        );
        const prefixedLink = wrappedInLink.replace('href="', urlPrefix);
        words[i] = prefixedLink.replace('%LINK%', translation);
      }
    });

    result = words.join(' ');
    if (result) {
      return result;
    }
    return wholeText;
  }
}
