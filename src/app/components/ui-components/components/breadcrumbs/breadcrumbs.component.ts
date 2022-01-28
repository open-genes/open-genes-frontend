import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbModel } from './breadcrumb.model';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: BreadcrumbModel[] = [
    {
      label: 'home_page_breadcrumb',
      url: '',
    },
  ];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
      this.breadcrumbs.push(...breadcrumbs);
    });
  }
}
