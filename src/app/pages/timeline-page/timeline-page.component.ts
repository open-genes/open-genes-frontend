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
  public subscription$ = new Subject();
  public genes: Genes[];
  public showMoreButtonVisible = true;
  public groups: {
    time: string;
    genes: Genes[];
  }[] = [];
  public counter = 20;
  private dateChanged: number | any;

  constructor(private apiService: ApiService, private localizedDatePipe: LocalizedDatePipe) {}

  ngOnInit(): void {
    this.getGenes();
  }

  public getGenes() {
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

            const time = this.localizedDatePipe?.transform(timestamp);
            const group = this.groups.find((g) => g.time === time);
            if (group) {
              group.genes.push(gene);
            } else {
              this.groups.push({
                time,
                genes: [gene],
              });
            }
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  showMore() {
    this.counter += 20;

    if (this.groups) {
      const genesQuantity = this.groups.reduce((previous, current) => {
        const total = previous + current.genes.length;
        return Math.floor(total);
      }, 0);

      if (genesQuantity >= Number(this.counter)) {
        this.showMoreButtonVisible = false;
      }
    }
  }
}
