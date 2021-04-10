import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  constructor(private http: HttpClient) {
  }

  public getMockResponse(): Observable<any> {
    const mock = this.http.get(environment.mockJsonUrl);
    return mock ? mock : of({});
  }
}
