import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { Genes } from '../../core/models';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { takeUntil } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private genesList: string[] = [];
  public appData = {
    build: environment.build,
    version: environment.version,
  };
  public subscription$ = new Subject();
  public error: number;
  public genesCounter: number;
  public lastGenes: Genes[];
  public randomHGNC = 'sirt1';
  public query: string;
  public geneHints: Pick<Genes, 'id' | 'name' | 'symbol' | 'aliases' | 'ensembl'>[] | Genes[] = [];
  public showProgressBar = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private readonly sessionStorageService: SessionStorageService,
  ) {
  }

  ngOnInit(): void {
    if (this.sessionStorageService.getStorageValue('genesCounter')) {
      this.genesCounter = this.sessionStorageService.getStorageValue('genesCounter');
      if (!this.genesCounter) {
        this.getGenesCount();
      }
    } else {
      this.getGenesCount();
    }

    if (this.sessionStorageService.getStorageValue('byLatest')) {
      this.lastGenes = this.sessionStorageService.getStorageValue('byLatest');
      if (this.lastGenes.length === 0) {
        this.getLastEditedGenes();
      }
    } else {
      this.getLastEditedGenes();
    }

    if (this.sessionStorageService.getStorageValue('genesList')) {
      this.genesList = this.sessionStorageService.getStorageValue('genesList');
      if (this.genesList.length === 0) {
        this.getGenesForRandomQuery();
      }
    } else {
      this.getGenesForRandomQuery();
    }
  }

  private getGenesCount(params: HttpParams = new HttpParams().set('pageSize', 1)): void {
    this.apiService.getGenesV2(params)
      .pipe(takeUntil(this.subscription$))
      .subscribe(data => {
        this.genesCounter = data.options.objTotal;
        this.sessionStorageService.setStorage('genesCounter', data.options.objTotal);
      });
  }

  private getGenesForRandomQuery(): void {
    this.apiService.getSymbols()
      .pipe(takeUntil(this.subscription$))
      .subscribe((gene) => {
        this.genesList = gene.map((g) => g.symbol);
        if (this.genesList.length > 0) {
          this.randomHGNC = this.genesList[Math.floor(Math.random() * this.genesList.length)];
        }
    });
  }

  private getHints(query: string): void {
    if (query && query.length > 1) {
      this.showProgressBar = true;
      this.apiService
        .getGenesMatchByString(query, undefined)
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (searchData) => {
            this.geneHints = searchData.items; // If nothing found, will return empty array
            this.showProgressBar = false;
          },
          (error) => {
            console.warn(error);
            this.showProgressBar = false;
          },
        );
    } else {
      this.geneHints = [];
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
        },
        (error) => {
          this.error = error;
        },
      );
  }

  public onQueryChange(query: string): void {
    const queryLength = query?.length ? query.split(',').length : 0;
    this.query = query;
    if (queryLength > 1) {
      const filteredQueryArray = query
        .split(',')
        .filter(q => q)
        .map(q => q.trim());

      query = filteredQueryArray[filteredQueryArray.length - 1];
    }
    this.getHints(query);
  }

  public goToGenesPage(query: string) {
    if (query && query.length > 0) {
      void this.router.navigate(['/genes'], { queryParams: { bySuggestions: query } });
    }
  }
}
