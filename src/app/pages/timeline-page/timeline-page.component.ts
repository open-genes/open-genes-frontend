import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';
import { Genes } from '../../core/models';
import { LocalizedDatePipe } from '../../core/pipes/general/i18n-date.pipe';

interface GenesArrayByDate {
  genes: Genes[];
}

interface GenesArrayByDateChanged extends GenesArrayByDate {
  groupDateChanged: string;
}

interface GenesArrayByDateCreated extends GenesArrayByDate {
  groupDateCreated: string;
}

@Component({
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.scss'],
})
export class TimelinePageComponent implements OnInit, OnDestroy {
  public genes: Genes[];
  public genesGroupedByDateChanged: GenesArrayByDateChanged[] = [];
  public genesGroupedByDateCreated: GenesArrayByDateCreated[] = [];
  public showMoreButtonVisible = true;
  public groupOfGenesPerPage = 4;
  public loadedGenesQuantity = this.groupOfGenesPerPage;
  private dateChanged: number | any;

  private subscription$ = new Subject();

  constructor(private apiService: ApiService, private localizedDatePipe: LocalizedDatePipe) {}

  ngOnInit(): void {
    this.getGenes();
  }

  private getGenes() {
    this.apiService
      .getGenesV2()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (filteredGenes) => {
          const genes = filteredGenes.items;
          let timestampChanged,
            timestampCreated = 1562960035; // July 12 2019 - date when the first data was added

          genes.sort((a, b) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (!a.timestamp.changed || !b.timestamp.changed) {
              return Number(b.timestamp) - Number(a.timestamp);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return Number(b.timestamp.changed) - Number(a.timestamp.changed);
          });

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
            timestampCreated = !isNaN(this.dateChanged) && this.dateChanged !== 0 ? this.dateChanged : timestampCreated;
            timestampChanged = !isNaN(this.dateChanged) && this.dateChanged !== 0 ? this.dateChanged : timestampChanged;

            const changed = this.localizedDatePipe?.transform(timestampChanged * 1000);
            const groupByDateChanged = this.genesGroupedByDateChanged.find((g) => g.groupDateChanged === changed);
            if (groupByDateChanged) {
              groupByDateChanged.genes.push(gene);
            } else {
              this.genesGroupedByDateChanged.push({
                groupDateChanged: changed,
                genes: [gene],
              });
            }

            // TODO: DRY
            const created = this.localizedDatePipe?.transform(timestampCreated * 1000);
            const groupByDateCreated = this.genesGroupedByDateCreated.find((g) => g.groupDateCreated === created);
            if (groupByDateCreated) {
              groupByDateCreated.genes.push(gene);
            } else {
              this.genesGroupedByDateCreated.push({
                groupDateCreated: created,
                genes: [gene],
              });
            }
          });
        },
        (error) => {
          console.warn(error);
        }
      );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  public showMore() {
    if (this.genesGroupedByDateChanged?.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.groupOfGenesPerPage;
    }
  }
}
