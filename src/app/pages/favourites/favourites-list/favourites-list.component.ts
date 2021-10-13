import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  Output, ViewChild,
} from '@angular/core';
import { Gene, Genes } from '../../../core/models';
import { FavouritesService } from '../../../core/services/favourites.service';
import { FileExportService } from '../../../core/services/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-favourites-list',
  templateUrl: './favourites-list.component.html',
  styleUrls: ['./favourites-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesListComponent {
  public favourites: Genes[] = [];
  public downloadLink: string | SafeResourceUrl = '#';
  @Input() set favouriteGenes(_genes: Genes[]) {
    this.favourites = _genes;
  }

  @ViewChild('linkCopy') linkCopied: ElementRef;


  constructor(
    private readonly _cdRef: ChangeDetectorRef,
    private _favouritesService: FavouritesService,
    private _fileExportService: FileExportService,
    protected _snackBar: MatSnackBar,
  ) {
  }

  public unFavItem(geneId: number, index: number): void {
    this.favourites.splice(index, 1);
    this._favouritesService.removeFromFavourites(geneId);
    this._cdRef.markForCheck();
  }

  public clearFavs(): void {
    this.favourites.splice(0, this.favourites.length);
    this._favouritesService.clearFavourites();
    this._cdRef.markForCheck();
  }

  public downloadFavs(): void {
    this.downloadLink = this._fileExportService.downloadJson(this.favourites);
    this._cdRef.markForCheck();
  }

  shareGene() {
    const localStorageFavorites = localStorage.getItem('favourites').slice(1, -1);
    const textSplit = localStorageFavorites.split(',');
    const link = location.href + '?selected=' + textSplit.join();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(link);
    this._snackBar.open(this.linkCopied.nativeElement.textContent, '', {
      duration: 600,
    });
  }

}
