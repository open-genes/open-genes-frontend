import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Diet } from '../../../../core/models/open-genes-api/diet.model';
import { PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../../../core/models/settings.model';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../components/shared/snack-bar/snack-bar.component';

@Component({
  selector: 'app-diet-table',
  templateUrl: './diet-table.component.html',
  styleUrls: ['./diet-table.component.scss'],
})
export class DietTableComponent {
  @Input() set confirmedGenesList(genes: Diet[]) {
    if (genes) {
      this.genesList = genes;
    }
  }

  @Input() pagination: Pagination;
  @Input() isLoading: boolean;
  @Input() totalGenesLength: number;

  @Output() paginationChange: EventEmitter<Pagination> = new EventEmitter<Pagination>();
  @Output() isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public genesList: Diet[];
  public pageSizeOptions: number[] = [5, 10, 20];
  public displayedColumns: string[] = [
    'name',
    'lexpressionChangeLogFc',
    'pValue',
    'crResult',
    'measurementMethod',
    'measurementType',
    'restrictionPercent',
    'restrictionTime',
    'age',
    'organism',
    'line',
    'sex',
    'tissue',
    'experimentNumber',
    'doi',
    'expressionChangePercent',
    'isoform',
  ];

  constructor() {}

  public pageEventHandler(event: PageEvent): void {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    this.paginationChange.emit(this.pagination);
  }
  public sortData(sort: Sort): void {
    const data = this.genesList.slice();
    if (!sort.active || sort.direction === '') {
      this.genesList = data;
      return;
    }

    this.genesList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
