import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Genes } from '../../../core/models';
import { FavouritesService } from '../../../core/services/favourites.service';
import { FileExportService } from '../../../core/services/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-favourites-list',
  templateUrl: './favourites-list.component.html',
  styleUrls: ['./favourites-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesListComponent {
  public favourites: Genes[] = [];
  public downloadLink: string | SafeResourceUrl = '#';
  public link: string;
  public isPopoverOpen = false;

  @Input() set favouriteGenes(_genes: Genes[]) {
    this.favourites = _genes;
  }
  @Input() isSharedList = false;
  @ViewChild('linkCopy') linkCopied: ElementRef;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private favouritesService: FavouritesService,
    private fileExportService: FileExportService,
    protected _snackBar: MatSnackBar
  ) {}

  public unFavItem(geneId: number, index: number): void {
    this.favourites.splice(index, 1);
    this.favouritesService.removeFromFavourites(geneId);
    this.cdRef.markForCheck();
  }

  public clearFavs(): void {
    this.favourites.splice(0, this.favourites.length);
    this.favouritesService.clearFavourites();
    this.cdRef.markForCheck();
  }

  public downloadFavs(): void {
    this.downloadLink = this.fileExportService.downloadJson(this.favourites);
    this.cdRef.markForCheck();
  }

  public shareGene(): void {
    this.isPopoverOpen = !this.isPopoverOpen;
    const localStorageFavorites = localStorage.getItem('favourites').slice(1, -1);
    const textSplit = localStorageFavorites.split(',');
    this.link = location.href + '?selected=' + textSplit.join();
  }

  public copyLink(): void {
    void navigator.clipboard.writeText(this.link).then(() => {
      this._snackBar.open(this.linkCopied.nativeElement.textContent, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 600,
      });
    });
    this.isPopoverOpen = false;
  }

  public closeSharePopover(): void {
    this.isPopoverOpen = false;
  }
}
