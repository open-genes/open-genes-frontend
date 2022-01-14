import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orthologLinks',
})
export class OrthologLinksPipe implements PipeTransform {
  transform(wholeText: unknown, textToMatch: string): string {
    return this.parseUrl(wholeText, textToMatch);
  }

  private parseUrl(wholeText, textToMatch: string): string {
    if (wholeText.toLowerCase().includes(textToMatch)) {
      const url = 'https://flybase.org/reports/FBgn0002906';
      return wholeText.replace(wholeText, `<a href="${url}" target="_blank" class="link">${wholeText}</a>`) as string;
    }

    return wholeText as string;
  }
}
