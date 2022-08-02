import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Input,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  @Input() region: string;
  public showAnnouncement = false;
  private favouritesSubscription: Subscription;

  constructor(
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.favouritesSubscription.unsubscribe();
  }

  public updateView(): void {
    this.cdRef.markForCheck();
  }
}
