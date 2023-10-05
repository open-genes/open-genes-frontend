import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, Router, RouterEvent } from '@angular/router';
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
  private lang: string;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private readonly ipRegistryService: IpRegistryService,
    private settingsService: SettingsService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // TODO: OG-953
    // Set app language
    this.translate.addLangs(environment.languages);
    this.lang = environment.languages[1]; // English is a default language
    this.translate.use(this.lang);
    this.retrievedSettings = this.settingsService.getSettings();
  }

  ngOnInit(): void {
    this.outputVersion();

    this.router.events.pipe(takeUntil(this.subscription$)).subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd) {
        // Display/hide footer
        this.currentRoute = event.url;
        if (this.currentRoute === '/404') {
          this.isFooterVisible = false;
        }
        // Hide progress spinner on router event
        this.document.body.classList.remove('body--loading');
      }
    });

    // Set language from query parameter
    this.activatedRoute?.queryParams
      .pipe(takeUntil(this.subscription$))
      .subscribe((params) => {
        if (params['language']) {
          this.lang = params['language'];
          this.translate.use(this.lang);
          localStorage.setItem('lang', this.lang);
        }
      })

    this.setRegion();
    this.setCookieBannerState();
  }

  private outputVersion(): void {
    console.log(`version: ${this.app.version} \nbuild: ${this.app.build}`);
    // TODO: add output for logger
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
