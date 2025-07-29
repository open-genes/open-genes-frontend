import {
  ComponentFactoryResolver, ComponentRef, EventEmitter, Inject,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AlertComponent } from '../../components/ui-components/alert/alert.component';

export interface AlertItem {
  attachTo: ViewContainerRef;
  message: string;
  hasCloseButton: boolean;
  timer?: number;
}

export interface AlertComponentInterface {
  hasCloseButton: boolean;
  closeEvent: EventEmitter<never>;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private queue: AlertItem[] = [];
  private isAnyAlertDisplayed = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private resolver: ComponentFactoryResolver
  ) {}

  public pushAlertsToQueue(alerts: AlertItem[]): void {
    this.queue.push(...alerts);
  }

  public popAlertFromQueue(): void {
    if (this.isAnyAlertDisplayed || this.queue.length === 0) {
      return;
    }
    const alert = this.queue.shift();
    this.attachAlertToView(alert);
  }

  private cleanup(component: ComponentRef<AlertComponent>): void {
    component.destroy();
    this.isAnyAlertDisplayed = false;
    this.popAlertFromQueue();
  }

  private attachAlertToView(alert: AlertItem): void {
    if (!alert) {
      return;
    }
    const { attachTo, message, hasCloseButton, timer } = alert;
    const factory = this.resolver.resolveComponentFactory(AlertComponent);
    const element = this.document.createElement('p');
    element.innerHTML = message;

    this.isAnyAlertDisplayed = true;

    const ref = attachTo.createComponent(
      factory,
      0,
      null,
      [[element]]
    );
    (ref.instance).hasCloseButton = hasCloseButton;

    // Subscribe to close event
    const sub = ref.instance.closeEvent.subscribe(() => {
      sub.unsubscribe();
      this.cleanup(ref);
    });

    // Set close timer
    if (timer) {
      setTimeout(() => {
        if (ref) {
          sub.unsubscribe();
          this.cleanup(ref);
        }
      }, timer);
    }

    ref.changeDetectorRef.detectChanges();
  }
}
