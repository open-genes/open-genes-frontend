import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Genes } from 'src/app/core/models';
import { FavouritesService } from 'src/app/core/services/favourites.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FileExportService } from '../../core/services/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesComponent implements OnInit, OnDestroy {
  public favouriteGenes: Genes[];
  public error: number;
  public downloadLink: string | SafeResourceUrl = '#';
  public genes: Genes[];
  private favouriteGenesIds: number[] = [];
  private subscription$ = new Subject();

  constructor(
    public translate: TranslateService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly apiService: ApiService,
    private favouritesService: FavouritesService,
    private fileExportService: FileExportService
  ) {}

  public unFavItem(geneId: number): void {
    this.favouritesService.removeFromFavourites(geneId);
    this.cdRef.markForCheck();
  }

  public clearFavs(): void {
    this.favouritesService.clearFavourites();
    this.cdRef.markForCheck();
  }

  public updateView() {
    this.cdRef.markForCheck();
  }

  private downloadJson(data: any) {
    this.downloadLink = this.fileExportService.downloadJson(data);
  }

  private getData(): void {
    this.favouritesService
      .getItems()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (idList) => {
          if (idList) {
            this.favouriteGenesIds = idList;
            this.downloadJson(idList);
            this.cdRef.markForCheck();
          }
        },
        () => {
          this.favouriteGenesIds = [];
        }
      );

    this.apiService
      .getGenes()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (genes) => {
          this.genes = genes;
          this.favouriteGenes = genes.filter((gene) =>
            this.favouriteGenesIds.includes(gene.id)
          );

          this.downloadJson(this.favouriteGenes);
          console.log(this.favouriteGenes);
          this.cdRef.markForCheck();
        },
        (err) => {
          this.error = err;
        }
      );
  }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
