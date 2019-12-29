import { Injectable } from '@angular/core';

import { TableComponent } from './table.component';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private table: TableComponent;

  constructor() { }

  /**
   * Регистрация таблицы
   * @param tableComponent - Регистрируемая таблица
   */
  public register(tableComponent: TableComponent) {
    this.table = tableComponent;
  }

  /**
   * Сброс фильтров таблицы
   */
  public clearFilters(all: string) {
    this.table.clearFilters('all');
  }
}
