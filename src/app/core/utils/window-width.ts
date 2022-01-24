import { takeUntil } from 'rxjs/operators';
import { WindowService } from '../services/browser/window.service';
import { Subject } from 'rxjs';
import { ToMap } from './to-map';

export abstract class WindowWidth extends ToMap {
  public subscription$ = new Subject();
  public isMobile: boolean;
  public isTablet: boolean;
  public isTouchDevice = false;
  public breakpoints = {
    desktop: 1199.98,
    mobile: 767,
  };

  protected constructor(public windowService: WindowService) {
    super();

    if ('ontouchstart' in document.documentElement) {
      this.isTouchDevice = true;
    }
  }

  protected initWindowWidth(callback: any): void {
    this.windowService
      .setWindowWidth()
      .pipe(takeUntil(this.subscription$))
      .subscribe((width) => {
        this.isMobile = width <= this.breakpoints.desktop;
        this.isTablet = width > this.breakpoints.mobile && width <= this.breakpoints.desktop;
        callback();
      });
  }

  protected detectWindowWidth(callback: any): void {
    this.windowService.windowWidth$
      .pipe(takeUntil(this.subscription$))
      .subscribe((width) => {
        this.isMobile = width <= this.breakpoints.desktop;
        this.isTablet = width > this.breakpoints.mobile && width <= this.breakpoints.desktop;
        callback();
      });
  }
}
