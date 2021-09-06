import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Gene, Genes } from '../../../core/models';
import { FavouritesService } from '../../../core/services/favourites.service';

@Component({
  selector: 'app-favourites-list',
  templateUrl: './favourites-list.component.html',
  styleUrls: ['./favourites-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesListComponent {
  public favourites: Genes[] = [];
  @Input() set favouriteGenes(_genes: Genes[]) {
    this.favourites = _genes;
  }
  @Input() downloadLink: any;
  @Output() updateView: EventEmitter<boolean> = new EventEmitter();


  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private favouritesService: FavouritesService
  ) {}

  public unFavItem(geneId: number, index: number): void {
    this.favourites.splice(index, 1);
    this.favouritesService.removeFromFavourites(geneId);
    this.cdRef.markForCheck();
  }

  public clearFavs(): void {
    this.favourites = [];
    this.favouritesService.clearFavourites();
    this.cdRef.markForCheck();
  }
}
