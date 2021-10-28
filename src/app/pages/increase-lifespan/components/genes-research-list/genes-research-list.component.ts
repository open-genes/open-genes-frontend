import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Settings } from '../../../../core/models/settings.model';
import { SettingsService } from '../../../../core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../components/shared/snack-bar/snack-bar.component';
import { GenesWLifespanResearches } from '../../../../core/models/openGenesApi/genes-with-increase-lifespan-researches.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-genes-research-list',
  templateUrl: './genes-research-list.component.html',
  styleUrls: ['./genes-research-list.component.scss'],
})
export class GenesResearchListComponent implements OnInit, OnDestroy {
  @Input() set genesList(genes: GenesWLifespanResearches[]) {
    if (genes) {
      this.searchedData = genes;
      this.openSnackBar();
    }
  }

  @Output() loaded = new EventEmitter<boolean>();

  public searchedData: GenesWLifespanResearches[];
  public genesPerPage = 20;
  public loadedGenesQuantity = this.genesPerPage;
  public isLoading = false;

  private subscription$ = new Subject();
  private retrievedSettings: Settings;

  @ViewChild('commentModalBody') dialogRef: TemplateRef<any>;

  constructor(
    private settingsService: SettingsService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
    this.loaded.emit(true);
    this.cdRef.markForCheck();
  }

  private setInitialSettings(): void {
    this.retrievedSettings = this.settingsService.getSettings();
  }

  private openSnackBar(): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'items_found',
        length: this.searchedData ? this.searchedData.length : 0,
      },
      duration: 600,
    });
  }

  public loadMoreGenes(): void {
    if (this.searchedData?.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.genesPerPage;
    }
  }

  // TODO: DRY
  public openCommentModal(data): void {
    this.dialog.open(this.dialogRef, {
      data: data,
      panelClass: 'comment-modal',
      minWidth: '320px',
      maxWidth: '768px',
    });
  }

  public closeCommentModal(): void {
    this.dialog.closeAll();
  }

  /**
   * Error handling
   */
  private errorLogger(context: any, error: any) {
    console.warn(context, error);
  }
}
