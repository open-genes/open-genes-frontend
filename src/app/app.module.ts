import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_ROUTES, ROUTER_OPTIONS } from './app-routing';
import { HttpClientModule } from '@angular/common/http';
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
import { MatBadgeModule } from '@angular/material/badge';
import { IconModule } from './components/ui-components/components/icon/app-icon.module';
import { GoogleAnalyticsModule } from './modules/vendors/google-analytics.module';
import { DirectivesModule } from './directives/directives.module';
import { TermsModule } from './components/shared/terms/terms.module';
import { SnackBarModule } from './components/shared/snack-bar/snack-bar.module';

// required for AOT compilation
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http);

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, LanguageComponent, BurgerMenuComponent],
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
    MatBadgeModule,
    IconModule,
    GoogleAnalyticsModule,
    DirectivesModule,
    TermsModule,
    SnackBarModule,
  ],
  providers: [TranslateService, { provide: LOCALE_ID, useValue: 'en' }],
  exports: [MaterialModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
