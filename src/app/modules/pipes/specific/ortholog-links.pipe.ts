import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orthologLinkWrapper',
})
export class OrthologLinkWrapperPipe implements PipeTransform {
  transform(wholeText: unknown, item: any, className: string, ifFalse: { el: string; className: string }): string {
    return this.wrapOrthologIntoLink(wholeText, item, className, ifFalse);
  }

  private wrapOrthologIntoLink(
    wholeText,
    item: any,
    className: string,
    alternativeWrapper: { el: string; className: string }
  ): string {
    if (
      item.species?.latinName.toLowerCase().includes('drosophila') &&
      item.externalBaseName.toLowerCase() == 'flybase'
    ) {
      const url = `https://flybase.org/reports/${item.externalBaseId}`;
      return wholeText.replace(wholeText, `<a href="${url}" target="_blank" class="${className}">${wholeText}</a>`);
    } else if (alternativeWrapper) {
      return wholeText.replace(
        wholeText,
        `<${alternativeWrapper.el} class="${alternativeWrapper.className}">${wholeText}</${alternativeWrapper.el}>`
      );
    }

    return wholeText;
  }
}
