import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from '../shared/genes-list/services/filter.service';
import { FavouritesService } from '../../core/services/favourites.service';
import { Subscription } from 'rxjs';
import { FilterTypesEnum } from '../shared/genes-list/services/filter-types.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  private favouritesSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.favouritesSubscription.unsubscribe();
  }

  public updateView(): void {
    this.cdRef.markForCheck();
  }

  /**
   * Resetting Gene list filters
   */
  public clearSearch(filter?: FilterTypesEnum) {
    this.filterService.clearFilters(filter);
  }
}
