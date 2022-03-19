import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { FilterService } from '../shared/genes-list/services/filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  public showAnnouncement = true;
  private favouritesSubscription: Subscription;

  constructor(
    private readonly filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.favouritesSubscription.unsubscribe();
  }

  public updateView(): void {
    this.cdRef.markForCheck();
  }
}
