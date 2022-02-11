import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Diet } from '../../../../core/models/open-genes-api/diet.model';
import { PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../../../core/models/settings.model';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-diet-table',
  templateUrl: './diet-table.component.html',
  styleUrls: ['./diet-table.component.scss'],
})
export class DietTableComponent implements OnInit {
  @Input() set confirmedGenesList(genes: Diet[]) {
    if (genes) {
      this.genesList = genes;
    }
  }
  @Input() isLoading: boolean;
  @Input() totalGenesLength: number;

  @Output() paginationChange: EventEmitter<Pagination> = new EventEmitter<Pagination>();
  @Output() isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public genesList: Diet[];
  public pageSizeOptions: number[] = [5, 10, 20];
  public pagination: Pagination = {
    page: 1,
    pageSize: 20,
  };
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

  constructor() {
  }

  ngOnInit(): void {
  }

  public pageEventHandler(event: PageEvent): void {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    this.paginationChange.emit(this.pagination);
  }

  sortData(sort: Sort): void {}

}
