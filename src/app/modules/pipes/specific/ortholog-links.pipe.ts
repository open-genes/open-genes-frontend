import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orthologLinks',
})
export class OrthologLinksPipe implements PipeTransform {
  transform(wholeText: unknown, item: any): string {
    return this.parseUrl(wholeText, item);
  }

  private parseUrl(wholeText, item: any): string {
    if (
      item.species?.latinName.toLowerCase().includes('drosophila') &&
      item.externalBaseName.toLowerCase() == 'flybase'
    ) {
      const url = `https://flybase.org/reports/${item.externalBaseId}`;
      return wholeText.replace(wholeText, `<a href="${url}" target="_blank" class="link">${wholeText}</a>`);
    }

    return wholeText;
  }
}
