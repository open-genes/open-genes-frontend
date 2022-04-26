import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Input,
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
  @Input() region: string;
  public showAnnouncement = false;
  private favouritesSubscription: Subscription;

  constructor(
    private readonly filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    console.log(this.region);
  }

  ngOnDestroy(): void {
    this.favouritesSubscription.unsubscribe();
  }

  public updateView(): void {
    this.cdRef.markForCheck();
  }
}
