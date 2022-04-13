import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ResearchArguments } from '../../../../core/models/open-genes-api/researches.model';
import { takeUntil } from 'rxjs/operators';
import { PageOptions } from '../../../../core/models/api-response.model';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';

@Component({
  selector: 'app-research-tab',
  templateUrl: './research-tab.component.html',
  styleUrls: ['./research-tab.component.scss'],
})
export class ResearchTabComponent implements OnInit, OnDestroy {
  @Input() researchType: ResearchArguments;
  @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public researches: any[] = []; // TODO: typing
  public options: PageOptions;
  public page = 1;
  public errorStatus: string;

  private subscription$ = new Subject();

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.getResearches(this.researchType);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public getResearches(researchType: ResearchArguments): void {
    this.apiService
      .getResearches(researchType, this.page)
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (researches) => {
          this.researches = researches.items;
          this.options = researches.options;
          this.dataLoaded.emit(true);
        },
        (err) => {
          this.errorStatus = err.statusText;
        }
      );
  }

  public pageEventHandler(researchType: ResearchArguments, event: PageEvent): void {
    if (this.page < event.length) {
      this.page = this.page + 1;
      this.researches = [];
      this.getResearches(researchType);
    }
  }
}
