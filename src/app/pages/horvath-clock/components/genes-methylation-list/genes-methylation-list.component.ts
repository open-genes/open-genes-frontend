import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Settings } from '../../../../core/models/settings.model';
import { SettingsService } from '../../../../core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../components/shared/snack-bar/snack-bar.component';
import { GenesInHorvathClock } from '../../../../core/models/openGenesApi/genes-in-horvath-clock.model';

@Component({
  selector: 'app-genes-methylation-list',
  templateUrl: './genes-methylation-list.component.html',
  styleUrls: ['./genes-methylation-list.component.scss'],
})
export class GenesMethylationListComponent implements OnInit {
  @Input() genesList: GenesInHorvathClock[];
  @Input() compareWith: string[] = [];
  @Input() set searchQuery(query: string) {
    this.updateGeneListOnSearch(query !== undefined && query !== '' ? query : '');
  }

  @Output() loaded = new EventEmitter<boolean>();

  public searchedData: GenesInHorvathClock[];
  public genesPerPage = 20;
  public loadedGenesQuantity = this.genesPerPage;
  public isLoading = false;

  private subscription$ = new Subject();
  private retrievedSettings: Settings;

  constructor(
    private settingsService: SettingsService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.setInitialSettings();
  }

  ngOnInit(): void {
    this.setInitialState();
    this.loaded.emit(true);
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  /**
   * HTTP
   */
  private setInitialState(): void {
    this.searchedData = [...this.genesList];
    this.loaded.emit(true);
    this.cdRef.markForCheck();
  }

  private setInitialSettings(): void {
    this.retrievedSettings = this.settingsService.getSettings();
  }

  // TODO: Implement this method in a common abstract class
  public updateGeneListOnSearch(query: string): void {
    this.searchedData = this.genesList.filter((item) => {
      // TODO: DRY
      const searchedText = `${item.id} ${item?.ensembl ? item.ensembl : ''}
      ${item.symbol} ${item.name}`;
      return searchedText.toLowerCase().includes(query);
    });
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'items_found',
        length: this.searchedData.length ? this.searchedData.length : 0,
      },
      duration: 600,
    });
  }

  public loadMoreGenes(): void {
    if (this.searchedData?.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.genesPerPage;
    }
  }

  /**
   * Error handling
   */
  private errorLogger(context: any, error: any) {
    console.warn(context, error);
  }
}
