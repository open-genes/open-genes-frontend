import { Injectable } from '@angular/core';
import { BreadcrumbModel } from './breadcrumb.model';
import { ActivatedRouteSnapshot, Data } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {

  public addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: BreadcrumbModel[]) {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));

      if (route.data.breadcrumb) {
        const breadcrumb = {
          label: this.getLabel(route.data),
          url: '/' + routeUrl.join('/'),
        };
        breadcrumbs.push(breadcrumb);
      }

      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data.breadcrumb === 'function' ? data.breadcrumb(data) : data.breadcrumb;
  }
}
