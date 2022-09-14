import { takeUntil } from 'rxjs/operators';
import { WindowService } from '../services/browser/window.service';
import { Subject } from 'rxjs';
import { ToMap } from './to-map';

export type Viewport =
  | 'smartphone'
  | 'tablet'
  | 'desktop'
  | 'widescreen';

export abstract class WindowWidth extends ToMap {
  public subscription$ = new Subject();
  public isSmartphone: boolean;
  public isTablet: boolean;
  public isDesktop: boolean;
  public isWidescreen: boolean;
  public viewport: Viewport;
  public isMobile: boolean; // TODO: rename to isMobileDevice like isTouchDevice
  public isTouchDevice = false;
  public breakpoints = {
    tablet: 767.8,
    desktop: 1199.8,
    widescreen: 1399.8,
  };

  protected constructor(
    public windowService: WindowService
  ) {
    super();

    if ('ontouchstart' in document.documentElement) {
      this.isTouchDevice = true;
    }
  }

  private set(width: number): void {
    this.isMobile = width <= this.breakpoints.desktop;
    this.isSmartphone = width <= this.breakpoints.tablet;
    this.isTablet =
      width > this.breakpoints.tablet &&
      width <= this.breakpoints.desktop;
    this.isDesktop =
      width > this.breakpoints.desktop &&
      width <= this.breakpoints.widescreen;
    this.isWidescreen = width > this.breakpoints.widescreen;

    this.viewport = Object.entries({
      smartphone: this.isSmartphone,
      tablet: this.isTablet,
      desktop: this.isDesktop,
      widescreen: this.isWidescreen,
    })
      .filter(([, value]) => value === true)
      .map(([key]) => key)
      .join() as Viewport;
  }

  protected initWindowWidth(callback: any): void {
    this.windowService
      .setWindowWidth()
      .pipe(takeUntil(this.subscription$))
      .subscribe((width) => {
        this.set(width);
        callback();
      });
  }

  protected detectWindowWidth(callback: any): void {
    this.windowService.windowWidth$
      .pipe(takeUntil(this.subscription$))
      .subscribe((width) => {
        this.set(width);
        callback();
      });
  }
}
