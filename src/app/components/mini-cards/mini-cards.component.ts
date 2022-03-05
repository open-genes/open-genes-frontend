import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Genes } from '../../core/models';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mini-cards',
  templateUrl: './mini-cards.component.html',
  styleUrls: ['./mini-cards.component.scss'],
})
export class MiniCardsComponent {
  public subscription$ = new Subject();
  public error: number;
  public lastGenes: Genes[];

  @Output() showSkeletonChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private readonly sessionStorageService: SessionStorageService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.sessionStorageService.getStorageValue('byLatest')) {
      this.lastGenes = this.sessionStorageService.getStorageValue('byLatest');
      this.showSkeletonChange.emit(false);
    } else {
      this.getLastEditedGenes();
    }
  }

  public getLastEditedGenes(): void {
    this.apiService
      .getLastEditedGene()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (genes) => {
          this.lastGenes = genes;
          this.sessionStorageService.setStorage('byLatest', genes);
          this.showSkeletonChange.emit(false);
        },
        (error) => {
          this.error = error;
          this.showSkeletonChange.emit(false);
        }
      );
  }
}
