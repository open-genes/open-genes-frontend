import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IpRegistryService {
  constructor(private http: HttpClient) {}
  getIpData(): Observable<any> {
    return this.http.get<any>('https://api.ipregistry.co/?key=tryout');
  }
}
