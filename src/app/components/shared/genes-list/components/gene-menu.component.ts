import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnInit, Output,
} from '@angular/core';
import {Genes} from '../../../../core/models';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-gene-menu',
  templateUrl: './gene-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneMenuComponent implements OnInit {

  @Input() gene: Genes[];
  @Input() isFaved: Observable<boolean>;
  @Output() unFav: EventEmitter<number> = new EventEmitter();
  @Output() fav: EventEmitter<number> = new EventEmitter();
  isAddToFavoritesShown: boolean;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.isFaved.subscribe(value => {
      this.isAddToFavoritesShown = value;
      this.cdRef.markForCheck();
    });
  }

  unFavItem(id: number): void {
    this.unFav.emit(id);
  }

  favItem(id: number): void {
    this.fav.emit(id);
  }
}
