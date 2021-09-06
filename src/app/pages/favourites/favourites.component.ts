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
import { EMPTY, Subject } from 'rxjs';
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
  public genes: Genes[];
  private favouriteGenesIds: number[] = [];
  public error: number;
  public downloadLink: string | SafeResourceUrl = '#';
  private subscription$ = new Subject();

  constructor(
    public translate: TranslateService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly apiService: ApiService,
    private favouritesService: FavouritesService,
    private fileExportService: FileExportService
  ) {}

  private downloadJson(data: any) {
    this.downloadLink = this.fileExportService.downloadJson(data);
  }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  private getData(): void {
    this.favouritesService.getItems()
      .pipe(
        switchMap((idList) => {
          if (idList) {
            this.favouriteGenesIds = idList;
            this.cdRef.markForCheck();

            return this.apiService.getGenes();
          }

          return EMPTY;
        }),
        takeUntil(this.subscription$)
      )
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
}
