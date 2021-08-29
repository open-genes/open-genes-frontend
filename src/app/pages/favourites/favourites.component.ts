import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Genes } from 'src/app/core/models';
import { FavouritesService } from 'src/app/core/services/favourites.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileExportService } from '../../core/services/file-export.service';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  providers: [FavouritesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesComponent implements OnInit, OnDestroy {
  public favouriteGenes: Genes[];
  public error: number;
  public downloadLink: string | SafeResourceUrl = '#';
  private favouriteGenesIds: number[] = [];
  private subscription$ = new Subject();
  private genes: Genes[];

  constructor(
    public translate: TranslateService,
    private readonly apiService: ApiService,
    private favouritesService: FavouritesService,
    private fileExportService: FileExportService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.getGenes();
  }

  public unFavItem(geneId: number): void {
    this.favouritesService.removeFromFavourites(geneId);
    this.favouriteGenesIds = this.favouritesService.favourites;
    this.cdRef.markForCheck();
  }

  public clearFavs(): void {
    this.favouritesService.clearFavourites();
    this.favouriteGenesIds = this.favouritesService.favourites;
    this.cdRef.markForCheck();
  }

  private downloadJson(data: any) {
    this.downloadLink = this.fileExportService.downloadJson(data);
  }

  private getGenes(): void {
    this.favouritesService
      .getItems()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (genes) => {
          if (genes) {
            this.favouriteGenesIds = genes;
            this.downloadJson(genes);
          }
          this.cdRef.markForCheck();
        },
        () => {
          this.favouriteGenesIds = [];
        }
      );

    if (this.favouriteGenesIds.length !== 0) {
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
            this.cdRef.markForCheck();
          },
          (err) => {
            this.error = err;
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
