import { Component, EventEmitter, Renderer2, Input, Output } from '@angular/core';
import { Genes } from '../../../core/models';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent {
  @Input() genesQuantity: number;
  @Input() searchedData: Genes[];

  @Output()
  isGoModeTriggered: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  goSearchQuery: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  genesListQuery: EventEmitter<string> = new EventEmitter<string>();

  public isGoSearchMode = false;
  public searchForm: FormGroup;
  public showResult: boolean;

  constructor(private renderer: Renderer2) {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
  }

  private updateUIonSearch(): void {
    this.showResult = true;
    this.renderer.addClass(document.body, 'body--search-on-main-page-is-active');
  }

  public setGoSearchMode(state: boolean): void {
    this.isGoModeTriggered.emit(state);
    this.isGoSearchMode = state;
    this.searchForm.reset();
  }

  public onSearch(): void {
    const query: string = this.searchForm.get('searchField').value;
    if (this.isGoSearchMode) {
      this.goSearchQuery.emit(query.toLowerCase());
    } else {
      this.genesListQuery.emit(query.toLowerCase());
    }
    this.updateUIonSearch();
  }

  public onCancel(event): void {
    this.showResult = false;
    this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
    event.stopPropagation();
  }

  /*  public debounce(callback: any, time: number): () => void {
    let lastTime = 0;
    return function() {
      const now = new Date();

      // first run
      if (lastTime === 0) {
        callback();
      }

      if (now.getTime() - lastTime >= time) {
        callback();
        lastTime = now.getTime();
      }
    };
  }*/


}
