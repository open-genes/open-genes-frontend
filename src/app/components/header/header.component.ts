import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy, Output
} from '@angular/core';
import {Router} from '@angular/router';
import {GenesListService} from '../../modules/genes-list/genes-list.service';
import {FavouritesService} from '../../core/services/favourites.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Output() favsCounter: string; // counter output
  private favouritesSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly genesListService: GenesListService,
    private favouritesService: FavouritesService,
    private readonly cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getCounters();
  }

  /**
   * Сброс фильтров таблицы генов
   */
  clearFilters(all) {
    this.genesListService.clearFilters(all);
  }


  private getCounters() {
    this.favouritesSubscription = this.favouritesService.getNumberOfItems().subscribe((genes) => {
      this.favsCounter = genes.toString();
      this.cdRef.markForCheck();
    }, error => this.favsCounter = '0');
  }

  ngOnDestroy(): void {
    this.favouritesSubscription.unsubscribe();
  }
}
