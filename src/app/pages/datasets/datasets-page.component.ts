import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-download-page',
  templateUrl: './datasets-page.component.html',
  styleUrls: ['./datasets-page.component.scss'],
})
export class DatasetsPageComponent implements OnInit {
  public isParentRoute: boolean;

  constructor(private router: Router) {
    this.isParentRoute = this.router.url === '/datasets';
  }

  ngOnInit(): void {
    //this.isParentRoute = this.aRoute.parent === 'datasets';
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isParentRoute = this.router.url === '/datasets';
    });
  }
}
