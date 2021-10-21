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
  private dateChanged: number | any;

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
          let timestamp = 1562960035; // July 12 2019 - date when the first data was added
          genes.forEach((gene) => {
            // TODO: Fix this crutch for a union type error
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (Object.values(gene.timestamp).length > 1) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              this.dateChanged = Number(gene.timestamp?.changed);
            } else {
              this.dateChanged = Number(gene.timestamp);
            }
            timestamp = !isNaN(this.dateChanged) && this.dateChanged !== 0 ? this.dateChanged : timestamp;

            const time = this.localizedDatePipe?.transform(timestamp * 1000);
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