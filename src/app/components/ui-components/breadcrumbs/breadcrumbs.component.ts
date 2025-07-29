import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbModel } from './breadcrumb.model';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    RouterLinkWithHref,
    RouterLinkActive,
    NgForOf,
  ],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbModel[] = [
    {
      label: 'home_page_breadcrumb',
      url: '',
    },
  ];

  private unsubscribe$ = new Subject<any>();

  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {
  }

  ngOnInit(): void {
    this.aRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs: BreadcrumbModel[] = [];
        this.breadcrumbService.addBreadcrumb(root, [], breadcrumbs);

        this.breadcrumbs.push(...breadcrumbs);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
