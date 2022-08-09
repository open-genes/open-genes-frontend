import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Pagination } from '../../models/settings.model';
import { Observable } from 'rxjs';
import { Category } from '../../models/wordpress/category.model';
import { Articles } from '../../models/wordpress/articles.model';
import { environment } from '../../../../environments/environment';
import { Article } from '../../models/wordpress/article.model';

@Injectable({
  providedIn: 'root',
})
export class WordpressApiService {
  private url = environment.wordpressApiUrl;

  constructor(private http: HttpClient, private translate: TranslateService) {}

  getCategories(language?: string): Observable<Category[]> {
    const params = new HttpParams().set('slug', language ? language : this.translate.currentLang);
    console.log(this.translate.currentLang);
    return this.http.get<Category[]>(`${this.url}categories`, { params });
  }

  getArticlesByCategoryId(categoryId: number, pagination: Pagination): Observable<Articles[]> {
    let params = new HttpParams();
    params = params.set('categories', categoryId).set('page', pagination.page).set('per_page', pagination.pageSize);
    return this.http.get<Articles[]>(`${this.url}posts`, { params });
  }

  getArticleBySlug(slug: string): Observable<Article> {
    let params = new HttpParams();
    params = params.set('slug', slug);
    return this.http.get<any>(`${this.url}posts`, { params });
  }
}
