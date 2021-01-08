import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProteinAtlasApiService {
  private url = environment.proteinAtlasUrl;
  private params = "format=json?";

  constructor(private http: HttpClient) {}

  public getSupplementaryDataByGene(id: number): Observable<any> {
    return this.http.get(
      `${this.url}/https://www.proteinatlas.org/search/${id}?${this.params}`
    );
  }
}
