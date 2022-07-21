import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_ROUTES, ROUTER_OPTIONS } from './app-routing';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';
import localeZh from '@angular/common/locales/zh';

registerLocaleData(localeRu, 'ru');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeZh, 'zh');

import { AppComponent } from './app.component';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LanguageComponent } from './components/language/language.component';
import { BurgerMenuComponent } from './components/burger-menu/burger-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/vendors/material.module';
import { IconModule } from './components/ui-components/components/icon/app-icon.module';
import { GoogleAnalyticsModule } from './modules/vendors/google-analytics.module';
import { DirectivesModule } from './directives/directives.module';
import { TermHintModule } from './components/shared/terms/term-hint.module';
import { SnackBarModule } from './components/shared/snack-bar/snack-bar.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './core/services/custom-mat-paginator-int';
import { HttpReqInterceptor } from './core/utils/http-req.interceptor';
import { UiComponentsModule } from './components/ui-components/ui-components.module';

// required for AOT compilation
// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, '/assets/i18n/', `.json?v=${new Date().getTime()}`);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LanguageComponent,
    BurgerMenuComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES, ROUTER_OPTIONS),
    HttpClientModule,
    // ngx-translate and the loader module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    MaterialModule,
    IconModule,
    GoogleAnalyticsModule,
    DirectivesModule,
    TermHintModule,
    SnackBarModule,
    UiComponentsModule,
  ],
  providers: [
    TranslateService,
    { provide: LOCALE_ID, useValue: 'en' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpReqInterceptor,
      multi: true,
    },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
  ],
  exports: [MaterialModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
