import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { ResearchArguments, ResearchTypes } from '../../../../core/models/open-genes-api/researches.model';
import { map, takeUntil } from 'rxjs/operators';
import { ApiResponse, PageOptions } from '../../../../core/models/api-response.model';
import { Observable, of, Subject } from 'rxjs';
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

  public researches: ResearchTypes = [];
  public options: PageOptions;
  public page = 1;
  public slice: Observable<number>;
  public errorStatus: string;

  private subscription$ = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.getResearches(this.researchType);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public getResearches(researchType: ResearchArguments): void {
    if (!this.slice) {
      this.slice = of(20);
    }
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
          this.researches = [...this.researches, ...(researches.items as any)];
          // console.log(this.researches);
          this.options = researches.options;
          this.dataLoaded.emit(true);
        },
        (err) => {
          // TODO: error output
          this.errorStatus = err.statusText;
        }
      );
  }

  public showMore(event: any, researchType: ResearchArguments): void {
    this.renderer.addClass(event.target, 'show-more__button--active');
    this.page = this.page + 1;
    this.getResearches(researchType);
    this.slice = of(this.researches.length);
    this.renderer.removeClass(event.target, 'show-more__button--active');
  }
}
