import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GenesListService } from '../genes-list/genes-list.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private readonly router: Router,
              private readonly genesListService: GenesListService) { }

  ngOnInit() {
  }

  /**
   * Сброс фильтров таблицы генов
   */
  clearFilters(all: string) {
    this.genesListService.clearFilters('all');
  }
}
