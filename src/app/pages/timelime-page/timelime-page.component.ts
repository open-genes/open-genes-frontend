import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';
import { Genes } from '../../core/models';
import { LocalizedDatePipe } from '../../modules/pipes/general/i18n-date.pipe';

@Component({
  selector: 'app-timelime-page',
  templateUrl: './timelime-page.component.html',
  styleUrls: ['./timelime-page.component.scss'],
})
export class TimelimePageComponent implements OnInit, OnDestroy {
  public subscription$ = new Subject();
  public genes: Genes[];
  public groups: {
    time: string;
    genes: Genes[];
  }[] = [];
  counter = 20;

  constructor(private apiService: ApiService,
              private localizedDatePipe: LocalizedDatePipe) {
  }

  ngOnInit(): void {
    this.getGenes();
  }

  randomDate() {
    return Math.random();
  }


  public getGenes() {
    this.apiService
      .getGenes()
      .pipe(
        takeUntil(this.subscription$),
      )
      .subscribe(
        (genes) => {
          genes.forEach((gene) => {
            //start Для примера
            // @ts-ignore
            genes[10].timestamp = 23452352353;
            // @ts-ignore
            genes[12].timestamp = 322342342343;
            //end

            const time = this.localizedDatePipe?.transform(gene.timestamp);
            const group = this.groups.find(g => g.time === time);
            if (group) {
              group.genes.push(gene);
            } else {
              this.groups.push({
                time,
                genes: [gene],
              });
            }
          });
          console.log(this.groups);
        },
        (err) => {
          console.log(err);
        },
      );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  showMore() {
    this.counter += 20;
  }
}
