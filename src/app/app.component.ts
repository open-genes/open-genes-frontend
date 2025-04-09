import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, Router, RouterEvent } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { IpRegistryService } from './core/services/api/ipregistry.service';
import { Settings, SettingsEnum } from './core/models/settings.model';
import { SettingsService } from './core/services/settings.service';
import { WordpressApiService } from './core/services/api/wordpress-api.service';
import { WindowService } from './core/services/browser/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  public app = {
    build: environment.build,
    version: environment.version,
  };
  public region: string;
  public isScrolled = false;
  public isHomePage = false;
  public isErrorPage = false;
  public showCookieBanner = false;
  public footerContent: unknown;
  private retrievedSettings: Settings;
  private settingsKey = SettingsEnum;
  private subscription$ = new Subject();
  private scrollSubscription$: Subscription;
  private dynamicContent$ = new Subject<void>();
  private currentRoute = '';

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private readonly ipRegistryService: IpRegistryService,
    private settingsService: SettingsService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private wpApiService: WordpressApiService,
    private windowService: WindowService,
  ) {
    this.settingsService.setLanguage();
    this.retrievedSettings = this.settingsService.getSettings();
  }

  ngOnInit(): void {
    this.outputVersion();

    this.router.events.pipe(takeUntil(this.subscription$)).subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd) {
        // Display/hide footer
        this.currentRoute = event.url;
        if (this.currentRoute === '/404') {
          this.isErrorPage = true;
        } else if (this.currentRoute === '' || this.currentRoute === 'home') {
          this.isHomePage = true;
        } else {
          this.isErrorPage = false;
          this.isHomePage = false;
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
          this.settingsService.updateLanguage(params['language']);
        }
      })

    this.setRegion();
    this.setCookieBannerState();

    // Handle scroll events
    this.scrollSubscription$ = this.windowService.scroll$
      .subscribe((scrollPosition) => {
        const totalHeight = this.document.documentElement.scrollHeight - this.document.documentElement.clientHeight;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;
        this.isScrolled = scrollPercentage > 1;
      });

    // Get dynamic content for some sections
    this.wpApiService.getSectionContent('footer')
      .pipe(takeUntil(this.dynamicContent$))
      .subscribe((content) => {
        this.footerContent = content;
      });
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription$) {
      this.scrollSubscription$.unsubscribe();
    }
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
