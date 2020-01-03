import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnChanges, AfterViewInit {
  @Input() highlightText: string;         // Фрагмент текста, который необходимо выделить
  @Input() highlightMinLength: number;    // Минимальное количество символов для выделения

  constructor(private readonly element: ElementRef) {
    this.highlightMinLength = 3;
  }

  ngAfterViewInit(): void {
    this.highlightTextFragment();
  }

  /**
   * Очистка элемента от блоков выделения
   */
  clearHighlight() {
    const wrappers = this.element.nativeElement.querySelector('.text-highlight-wrapper');
    if (wrappers) {
      const parent = wrappers.parentNode;
      const text = parent.textContent;
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      const textNode = document.createTextNode(text);
      parent.appendChild(textNode);
    }
  }

  /**
   * Выделение фрагментов текста внутри элемента
   */
  highlightTextFragment() {
    if (this.highlightText.length >= this.highlightMinLength) {
      const index = this.element.nativeElement.textContent.toLowerCase().indexOf(this.highlightText.toLowerCase());
      if (index !== -1) {
        const range = new Range();
        range.setStart(this.element.nativeElement.childNodes[0], index);
        range.setEnd(this.element.nativeElement.childNodes[0], index + this.highlightText.length);
        const wrapper = document.createElement('mark');
        wrapper.classList.add('text-highlight');
        try {
          range.surroundContents(wrapper);
        } catch (e) {
          // console.error(e);
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.highlightText.currentValue && changes.highlightTextcurrentValue !== changes.highlightText.previousValue) {
      this.clearHighlight();
      this.highlightTextFragment();
    } else {
      this.clearHighlight();
    }
  }
}
