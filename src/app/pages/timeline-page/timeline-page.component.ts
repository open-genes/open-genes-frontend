import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';
import { Genes } from '../../core/models';
import { LocalizedDatePipe } from '../../modules/pipes/general/i18n-date.pipe';

@Component({
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.scss'],
})
export class TimelinePageComponent implements OnInit, OnDestroy {
  public genes: Genes[];
  public genesGroupedByDate: {
    time: string;
    genes: Genes[];
  }[] = [];
  public showMoreButtonVisible = true;
  public groupOfGenesPerPage = 4;
  public loadedGenesQuantity = this.groupOfGenesPerPage;

  private subscription$ = new Subject();

  constructor(private apiService: ApiService, private localizedDatePipe: LocalizedDatePipe) {
  }

  ngOnInit(): void {
    this.getGenes();
  }

  private getGenes() {
    this.apiService
      .getGenes()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (genes) => {
          genes.forEach((gene) => {
            const time = this.localizedDatePipe?.transform(gene.timestamp * 1000);
            const group = this.genesGroupedByDate.find((g) => g.time === time);
            if (group) {
              group.genes.push(gene);
            } else {
              this.genesGroupedByDate.push({
                time,
                genes: [gene],
              });
            }
          });
        },
        (err) => {
          console.log(err);
        },
      );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  public showMore() {
    if (this.genesGroupedByDate?.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.groupOfGenesPerPage;
    }
  }
}