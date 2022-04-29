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
  public region: string;
  public isFooterVisible = true;
  public retrievedSettings: Settings;

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
    } else if (
      navigator.language.substring(0, 2) === 'en' ||
      navigator.language.substring(0, 2) === 'ru'
    ) {
      this.lang = navigator.language.substring(0, 2);
    } else {
      this.lang = environment.languages[1];
    }
    this.translate.use(this.lang);
    this.retrievedSettings = this.settingsService.getSettings();
  }

  ngOnInit(): void {
    console.log(`version: ${environment.version} \nbuild: ${environment.build}`);

    // Handle router state
    this.router.events
      .pipe(takeUntil(this.subscription$))
      .subscribe((event: RouterEvent) => {
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

  acceptCookies(): void {
    this.retrievedSettings.showCookieBanner = false;
    this.settingsService.setSettings(this.settingsKey.showCookieBanner, false);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
