import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { FilterService } from "../shared/genes-list/services/filter.service";
import { FavouritesService } from "../../core/services/favourites.service";
import { Subscription } from "rxjs";
import { FilterTypesEnum } from "../shared/genes-list/services/filter-types.enum";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() favsCounter: string; // counter output
  private favouritesSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly filterService: FilterService,
    private favouritesService: FavouritesService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getCounters();
  }

  ngOnDestroy(): void {
    this.favouritesSubscription.unsubscribe();
  }

  /**
   * Resetting Gene list filters
   */
  public clearSearch(filter?: FilterTypesEnum) {
    this.filterService.clearFilters(filter);
  }

  private getCounters() {
    this.favouritesSubscription = this.favouritesService
      .getNumberOfItems()
      .subscribe(
        (genes) => {
          this.favsCounter = genes.toString();
          this.cdRef.markForCheck();
        },
        (error) => (this.favsCounter = "0")
      );
  }
}
