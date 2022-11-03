import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ApiGeneSearchParameters } from '../../../../../core/models/filters/filter.model';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GeneFiltersPanelComponent } from '../gene-filters-panel.component';

interface AppliedFilter {
  filterType: ApiGeneSearchParameters;
  event: MatSelectChange | MatCheckboxChange;
}

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneFiltersPanelComponent),
      multi: true,
    },
  ],
})
export class SelectSearchComponent {
  @Input() placeholder = '';
  @Input() filterType: ApiGeneSearchParameters;
  @Input() items: Map<number, any> = new Map();
  @Input() predefinedItems: any[] = [];

  @Output() filterApplied: EventEmitter<AppliedFilter> = new EventEmitter<AppliedFilter>();
  @Output() searchApplied: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  apply(filterType: ApiGeneSearchParameters, $event: MatSelectChange | MatCheckboxChange) {
    this.filterApplied.emit({ filterType: filterType, event: $event });
  }

  filter($event: KeyboardEvent) {
    this.searchApplied.emit($event);
  }

  compareSelectValues(value1: any, value2: any): boolean {
    if (value1 && value2) {
      return value1 === value2;
    }
    return false;
  }
}
