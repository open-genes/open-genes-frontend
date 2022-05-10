import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ResearchArguments, ResearchTypes } from '../../../../core/models/open-genes-api/researches.model';
import { map, takeUntil } from 'rxjs/operators';
import { ApiResponse, PageOptions } from '../../../../core/models/api-response.model';
import { Subject } from 'rxjs';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';
import { AdditionalInterventionResolver } from 'src/app/core/utils/additional-intervention-resolver';

@Component({
  selector: 'app-research-tab',
  templateUrl: './research-tab.component.html',
  styleUrls: ['./research-tab.component.scss'],
})
export class ResearchTabComponent extends AdditionalInterventionResolver implements OnInit, OnDestroy {
  @Input() researchType: ResearchArguments;
  @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public researches: any[] = [];
  public options: PageOptions;
  public page = 1;
  public slice = 20;
  public errorStatus: string;

  private subscription$ = new Subject();

  constructor(private readonly apiService: ApiService) {
    super();
  }

  ngOnInit(): void {
    this.getResearches(this.researchType);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public getResearches(researchType: ResearchArguments): void {
    console.log('researchType', researchType);
    this.apiService
      .getResearches(researchType, this.page)
      .pipe(
        takeUntil(this.subscription$),
        map((r: ApiResponse<ResearchTypes>) => {
          if (researchType === 'lifespan-change') {
            r.items = r.items.filter((r: any) => this.resolveAdditionalIntervention(r));
          }
          return r;
        })
      )
      .subscribe(
        (researches) => {
          console.log(researches.items);
          this.researches = researches.items;
          this.options = researches.options;
          this.dataLoaded.emit(true);
        },
        (err) => {
          this.errorStatus = err.statusText;
        }
      );
  }

  public showMore(researchType: ResearchArguments): void {
    if (this.page) {
      this.page = this.page + 1;
      this.slice = this.page * 20;
      this.researches = [];
      this.getResearches(researchType);
    }
  }
}
