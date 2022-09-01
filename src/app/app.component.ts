import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, RouteConfigLoadEnd, Router, RouterEvent } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IpRegistryService } from './core/services/api/ipregistry.service';
import { Settings, SettingsEnum } from './core/models/settings.model';
import { SettingsService } from './core/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public app = {
    build: environment.build,
    version: environment.version,
  };
  public region: string;
  public isFooterVisible = true;
  public showCookieBanner = false;

  private retrievedSettings: Settings;
  private settingsKey = SettingsEnum;
  private subscription$ = new Subject();
  private currentRoute = '';
  private readonly lang: string;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private readonly ipRegistryService: IpRegistryService,
    private settingsService: SettingsService,
    private translate: TranslateService,
    private router: Router
  ) {
    // Set app language
    this.translate.addLangs(environment.languages);
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang');
    } else if (navigator.language.substring(0, 2) === 'en' || navigator.language.substring(0, 2) === 'ru') {
      this.lang = navigator.language.substring(0, 2);
    } else {
      this.lang = environment.languages[1];
    }
    this.translate.use(this.lang);
    this.retrievedSettings = this.settingsService.getSettings();
  }

  ngOnInit(): void {
    this.outputVersion();
    this.handleRouterState();
    this.setRegion();
    this.setCookieBannerState();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  private outputVersion(): void {
    console.log(`version: ${this.app.version} \nbuild: ${this.app.build}`);
    // TODO: add output for logger
  }

  private handleRouterState(): void {
    this.router.events.pipe(takeUntil(this.subscription$)).subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd) {
        // Hide progress spinner or progress bar
        this.currentRoute = event.url;
        if (this.currentRoute === '/404') {
          this.isFooterVisible = false;
        }
        setTimeout(() => {
          this.document.body.classList.remove('body--loading');
        }, 2000);
      }
    });
  }

  private setRegion(): void {
    if (!localStorage.getItem('region')) {
      this.ipRegistryService
        .getIpData()
        .pipe(takeUntil(this.subscription$))
        .subscribe((data) => {
          if (data) {
            this.region = data.location?.country?.name;
            localStorage.setItem('region', this.region);
          }
        });
    } else {
      this.region = localStorage.getItem('region');
    }
  }

  private setCookieBannerState(): void {
    this.showCookieBanner =
      this.retrievedSettings.showCookieBanner === undefined || this.retrievedSettings.showCookieBanner === true;
  }

  public acceptCookies(): void {
    this.retrievedSettings.showCookieBanner = false;
    this.settingsService.setSettings(this.settingsKey.showCookieBanner, false);
    this.setCookieBannerState();
  }
}
