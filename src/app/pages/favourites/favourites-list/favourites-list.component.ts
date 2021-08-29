import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Gene } from '../../../core/models';

@Component({
  selector: 'app-favourites-list',
  templateUrl: './favourites-list.component.html',
  styleUrls: ['./favourites-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesListComponent {
  public genes: Gene[] = [];
  public favourites: Gene[] = [];

  @Input() set genericGenes(_genes: Gene[]) {
    this.genes = _genes;
    this.updateView.emit(true);
  }
  @Input() set favouriteGenes(_genes: Gene[]) {
    this.favourites = _genes;
    this.updateView.emit(true);
  }

  @Output() unFav: EventEmitter<number> = new EventEmitter();
  @Output() clear: EventEmitter<boolean> = new EventEmitter();
  @Output() updateView: EventEmitter<boolean> = new EventEmitter();
  @Input() downloadLink: any;

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public unFavItem(id): void {
    this.unFav.emit(id);
  }

  public clearFavs(): void {
    this.clear.emit();
  }
}
