import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpReqInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers = new HttpHeaders();
    headers = headers
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');


    if (req.url.includes('/api/') && !req.url.includes('https')) {
      const request = req.clone({
        headers,
        url: environment.apiUrl + req.url,
      });
      return next.handle(request);
    }

    return next.handle(req);
  }
}
