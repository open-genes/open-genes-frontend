import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  constructor(private http: HttpClient) {}

  public getMockResponse(params = null): Observable<any> {
    // Mock request params
    const page = params?.page ? params.page - 1 : 0;
    const mock = this.http.get(environment.mockJsonUrl[page]);
    return mock ? mock : of({});
  }
}
