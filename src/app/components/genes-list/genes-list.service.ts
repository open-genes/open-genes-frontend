import { Injectable } from '@angular/core';

import { GenesListComponent } from './genes-list.component';

@Injectable({
  providedIn: 'root'
})
export class GenesListService {
  private genesList: GenesListComponent;

  constructor() { }

  /**
   * Регистрация таблицы
   * @param genesListComponent - Регистрируемая таблица
   */
  public register(genesListComponent: GenesListComponent) {
    this.genesList = genesListComponent;
  }

  /**
   * Сброс фильтров таблицы
   */
  public clearFilters(all: string) {
    this.genesList.clearFilters('all');
  }
}
