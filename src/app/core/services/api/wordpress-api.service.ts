import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Pagination } from '../../models/settings.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../../models/wordpress/category.model';
import { Articles } from '../../models/wordpress/articles.model';
import { environment } from '../../../../environments/environment';
import { Article } from '../../models/wordpress/article.model';
import { switchMap, take } from 'rxjs/operators';

type DynamicContentSections = 'footer' | 'sidebar' | 'wizard' | string;

@Injectable({
  providedIn: 'root',
})
export class WordpressApiService {
  private url = environment.wordpressApiUrl;
  // TODO: Add translations to the database
  // private currentLang = this.translate.currentLang;
  private currentLang = 'en';
  private footerContentSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private sidebarContentSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private wizardContentSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private otherContentSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient, private translate: TranslateService) {
  }

  public getCategories(language?: string): Observable<Category[]> {
    const params = new HttpParams().set('slug', language ? language : this.currentLang);
    return this.http.get<Category[]>(`${this.url}categories`, { params });
  }

  public getArticlesByCategoryId(categoryId: number, pagination: Pagination): Observable<Articles[]> {
    let params = new HttpParams();
    params = params.set('categories', categoryId).set('page', pagination.page).set('per_page', pagination.pageSize);
    return this.http.get<Articles[]>(`${this.url}posts`, { params });
  }

  public getArticleBySlug(slug: string): Observable<Article> {
    let params = new HttpParams();
    params = params.set('slug', slug);
    return this.http.get<any>(`${this.url}posts`, { params });
  }

  public getSectionContent(section: DynamicContentSections): Observable<string> {
    return this.getArticleBySlug(section).pipe(
      take(1),
      switchMap((res) => {
        if (res) {
          const content = res[0].content?.rendered;
          switch (section) {
            case 'footer':
              this.footerContentSubject.next(content);
              return this.footerContentSubject.asObservable();
            case 'sidebar':
              this.sidebarContentSubject.next(content);
              return this.sidebarContentSubject.asObservable();
            case 'wizard':
              this.wizardContentSubject.next(content);
              return this.wizardContentSubject.asObservable();
            default:
              this.otherContentSubject.next(content);
              return this.otherContentSubject.asObservable();
          }
        }
      })
    );
  }
}
