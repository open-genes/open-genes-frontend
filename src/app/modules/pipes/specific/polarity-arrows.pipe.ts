import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'polarityArrows',
})
export class PolarityArrowsPipe implements PipeTransform {
  private positiveWords = ['improves', 'increases', 'gain', 'улучшает', 'улучшение', 'усиление', 'повышает'];
  private negativeWords = [
    'decreases',
    'deteriorates',
    'loss',
    'ухудшает',
    'ухудшение',
    'снижает',
    'снижение',
    'ослабление',
  ];
  private neutralWords = ['no change', 'нет изменений', 'переключение'];

  transform(text: string) {
    return this.wrapText(text);
  }

  private wrapText(text: string) {
    const str = text.split(' ');
    let classNameModifier = '';

    str.forEach((s) => {
      if (this.positiveWords.some((s) => this.positiveWords.includes(s))) {
        classNameModifier = 'term-w-p--positive';
      } else if (this.negativeWords.some((s) => this.negativeWords.includes(s))) {
        classNameModifier = 'term-w-p--negative';
      } else if (this.neutralWords.some((s) => this.neutralWords.includes(s))) {
        classNameModifier = 'term-w-p--neutral';
      }
    });

    return `<span class='term-w-p ${classNameModifier}'>${text}</span>`;
  }
}
