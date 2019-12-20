import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TableService } from '../../shared/table/table.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private readonly router: Router,
              private readonly tableService: TableService) { }

  ngOnInit() {
  }

  /**
   * Сброс фильтров таблицы генов
   */
  clearFilters() {
    this.tableService.clearFilters();
  }
}
