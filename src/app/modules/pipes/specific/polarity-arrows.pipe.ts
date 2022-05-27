import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'polarityArrows',
})
export class PolarityArrowsPipe implements PipeTransform {
  private positiveWords = ['improves', 'increases', 'улучшает', 'повышает'];
  private negativeWords = ['decreases', 'deteriorates', 'ухудшает', 'снижает'];
  private neutralWords = ['no change', 'нет изменений'];

  transform(text: string) {
    return this.wrapText(text);
  }

  private wrapText(text: string) {
    const str = text.split(' ');
    let className = 'term-w-p';

    str.forEach((s) => {
      if (this.positiveWords.some((s) => this.positiveWords.includes(s))) {
        className += ' term-w-p--positive';
      } else if (this.negativeWords.some((s) => this.positiveWords.includes(s))) {
        className += ' term-w-p--negative';
      } else if (this.neutralWords.some((s) => this.positiveWords.includes(s))) {
        className += ' term-w-p--neutral';
      }
    });

    return `<span class='${className}'>${text}</span>`;
  }
}
