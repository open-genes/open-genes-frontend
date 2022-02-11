import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Pagination, SearchMode } from '../../core/models/settings.model';
import { Diet } from '../../core/models/open-genes-api/diet.model';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DietComponent implements OnInit {
  public genes: Diet[];
  public searchedGenesList: Diet[];
  public confirmedGenesList: Diet[];
  public totalGenesLength: number;


  public isLoading = false;
  public errorStatus: string;
  public searchMode: SearchMode = 'searchByGenes';


  constructor(private apiService: ApiService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    this.isLoading = true;
    this.apiService.getGenesForDiet()
      .subscribe((res) => {
        debugger;
        this.isLoading = false;
        this.genes = res.items;
        this.confirmedGenesList = res.items;
        this.totalGenesLength = res.options.objTotal;
        this.cdRef.markForCheck();
      },
        (error) => {
          this.errorStatus = error.statusText;
          this.cdRef.markForCheck()
        });
  }

  public setSearchQuery(query: string): void {
    this.searchByGenes(query);
  }

  public updateGenesList(query): void {

  }

  private searchByGenes(query: string): void {

  }

  public onPaginationChange(event: Pagination): void {
    this.isLoading = true;
    this.apiService.getGenesForDiet(event).subscribe((res) => {
        debugger;
        this.genes = res.items;
        this.confirmedGenesList = res.items;
        this.totalGenesLength = res.options.objTotal;
        this.isLoading = false;
        this.cdRef.markForCheck();
      },
      (error) => {
        this.errorStatus = error.statusText;
        this.cdRef.markForCheck()
      });
  }
}
