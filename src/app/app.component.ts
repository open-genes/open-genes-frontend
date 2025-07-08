import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
import { AlertItem, AlertService } from './core/services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
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
  private showNewReleaseNotification: boolean;
  private subscription$ = new Subject();
  private scrollSubscription$: Subscription;
  private dynamicContent$ = new Subject<void>();
  private currentRoute = '';
  @ViewChild('alertsContainer', { read: ViewContainerRef })
  alertsContainer: ViewContainerRef;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private readonly ipRegistryService: IpRegistryService,
    private settingsService: SettingsService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private wpApiService: WordpressApiService,
    private windowService: WindowService,
    private alertService: AlertService,
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
    this.setNewReleaseNotificationState();

    // Handle scroll events
    this.scrollSubscription$ = this.windowService.scroll$
      .subscribe((scrollPosition) => {
        const scrollThreshold = 20;
        this.isScrolled = scrollPosition > scrollThreshold;
      });

    // Get dynamic content for some sections
    this.wpApiService.getSectionContent('footer')
      .pipe(takeUntil(this.dynamicContent$))
      .subscribe((content) => {
        this.footerContent = content;
      });
  }

  ngAfterViewInit(): void {
    if (this.showNewReleaseNotification) {
      this.showNewReleaseNotifications();
    }
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
            // TODO: settings service
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

  private setNewReleaseNotificationState(): void {
    this.showNewReleaseNotification =
      this.retrievedSettings.showNewReleaseNotification === undefined || this.retrievedSettings.showNewReleaseNotification === true;
  }

  public dontShowNewReleaseNotifications(): void {
    this.retrievedSettings.showNewReleaseNotification = false;
    this.settingsService.setSettings(this.settingsKey.releaseNotifications, false);
    this.setNewReleaseNotificationState();
  }

  private showNewReleaseNotifications(): void {
    const notifications: AlertItem[] = [
      {
        attachTo: this.alertsContainer,
        message: 'New site release! Read about the latest changes on <a href="https://github.com/open-genes/open-genes-frontend/releases" target="_blank">GitHub</a>',
        hasCloseButton: true,
        timer: 5 * 1000 * 60,
      },
      {
        attachTo: this.alertsContainer,
        message: 'We have added new languages to our site. If you encounter any mistakes or would like to request a language, please let us know <a href="https://localazy.com/p/open-genes-website" target="_blank">Translations</a>',
        hasCloseButton: true,
      },
    ];
    this.alertService.pushAlertsToQueue(notifications);
    this.alertService.popAlertFromQueue();
    this.dontShowNewReleaseNotifications();
  }
}
