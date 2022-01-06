import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from './breadcrumb';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: BreadCrumb[] = [
    {
      label: 'home_page_breadcrumb',
      url: '',
    },
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$
      .subscribe((breadcrumbs) => {
        this.breadcrumbs.push(...breadcrumbs);
      });
  }

}
