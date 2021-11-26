import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { Settings } from '../../../../core/models/settings.model';
import { SettingsService } from '../../../../core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../../components/shared/snack-bar/snack-bar.component';
import { GenesWLifespanResearches } from '../../../../core/models/openGenesApi/genes-with-increase-lifespan-researches.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonModalComponent } from '../../../../components/ui-components/components/modals/common-modal/common-modal.component';
import { PageEvent } from '@angular/material/paginator';

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
  public pageSizeOptions: number[] = [5, 10, 20];
  public genesPerPage = 20;
  public isLoading = false;

  private subscription$ = new Subject();
  private retrievedSettings: Settings;

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

  // TODO: DRY
  public openCommentModal(title, body, template = null): void {
    this.dialog.open(CommonModalComponent, {
      data: { title: title, body: body, template: template },
      panelClass: 'comment-modal',
      minWidth: '320px',
      maxWidth: '768px',
    });
  }

  public closeCommentModal(): void {
    this.dialog.closeAll();
  }

  public pageEventHandler(event: PageEvent): void {
    const start = event.pageIndex * event.pageSize;
    const end = start + event.pageSize;
    this.searchedData = this.genesList.slice(start, end);
    console.log(event)
  }

  /**
   * Error handling
   */
  private errorLogger(context: any, error: any) {
    console.warn(context, error);
  }
}
