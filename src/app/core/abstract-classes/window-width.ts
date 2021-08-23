import { takeUntil } from 'rxjs/operators';
import { WindowService } from '../services/browser/window.service';
import { Subject } from 'rxjs';

export abstract class WindowWidth {
  public subscription$ = new Subject();
  public isMobile: boolean;
  private resDesktop = 1199.98;

  constructor(public windowService: WindowService) {}

  protected initWindowWidth(callback: any): void {
    this.windowService
      .setWindowWidth()
      .pipe(takeUntil(this.subscription$))
      .subscribe((width) => {
        this.isMobile = width <= this.resDesktop;
        callback();
      });
  }

  protected detectWindowWidth(callback: any): void {
    this.windowService.windowWidth$
      .pipe(takeUntil(this.subscription$))
      .subscribe((width) => {
        this.isMobile = width <= this.resDesktop;
        callback();
      });
  }
}
