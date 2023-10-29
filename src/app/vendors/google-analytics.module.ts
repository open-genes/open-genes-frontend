import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule,
} from 'ngx-google-analytics'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    NgxGoogleAnalyticsModule.forRoot(environment.gaTrackingCode),
    NgxGoogleAnalyticsRouterModule,
  ],
  providers: [],
})
export class GoogleAnalyticsModule {}
