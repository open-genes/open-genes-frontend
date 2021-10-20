import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Researches } from '../../../core/models/openGenesApi/researches.model';
import { MatDialog } from '@angular/material/dialog';
import { PubmedApiService } from '../../../core/services/api/pubmed-api.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ArticleInfo } from '../../../core/models/openGenesApi/article-info';

@Component({
  selector: 'app-researches',
  templateUrl: './researches.component.html',
  styleUrls: ['./researches.component.scss'],
})
export class ResearchesComponent implements OnInit {
  @Input() researches: Researches;

  public isIncreaseLifespan: boolean;
  public isAgeRelatedChanges: boolean;
  public isInterventionAffectsAgingProcess: boolean;
  public isProteinRegulatesOtherGenes: boolean;
  public isGeneAssociatedWithProgeriaSyndromes: boolean;
  public isGeneAssociatedWithLongevityEffects: boolean;
  public isAdditionalEvidences: boolean;

  public articleInfo: ArticleInfo;
  public isLoading = false;

  private subscription$ = new Subject();

  @ViewChild('commentModalBody') dialogRef: TemplateRef<any>;
  @ViewChild('articleInfoModal') articleRef: TemplateRef<any>;

  constructor(
    private pubmedApiService: PubmedApiService,
    public translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isIncreaseLifespan = this.researches?.increaseLifespan && this.researches?.increaseLifespan.length !== 0;

    this.isAgeRelatedChanges =
      this.researches?.ageRelatedChangesOfGene && this.researches?.ageRelatedChangesOfGene.length !== 0;

    this.isInterventionAffectsAgingProcess =
      this.researches?.interventionToGeneImprovesVitalProcesses &&
      this.researches?.interventionToGeneImprovesVitalProcesses.length !== 0;

    this.isProteinRegulatesOtherGenes =
      this.researches?.proteinRegulatesOtherGenes && this.researches?.proteinRegulatesOtherGenes.length !== 0;

    this.isGeneAssociatedWithProgeriaSyndromes =
      this.researches?.geneAssociatedWithProgeriaSyndromes &&
      this.researches?.geneAssociatedWithProgeriaSyndromes.length !== 0;

    this.isGeneAssociatedWithLongevityEffects =
      this.researches?.geneAssociatedWithLongevityEffects &&
      this.researches?.geneAssociatedWithLongevityEffects.length !== 0;

    this.isAdditionalEvidences =
      this.researches?.additionalEvidences && this.researches?.additionalEvidences.length !== 0;
  }

  public openCommentModal(data): void {
    this.dialog.open(this.dialogRef, {
      data: data,
      panelClass: 'comment-modal',
      minWidth: '320px',
      maxWidth: '768px',
    });
  }

  public openArticleInfoModal(doi): void {
    this.isLoading = true
    this.pubmedApiService
      .getArticleByDoi(doi)
      .pipe(
        map((res) => {
          const articleInfo: ArticleInfo = {
            title: res.bibliographic_data.artifact_title,
            publisher: res.bibliographic_data.publisher,
            publicationYear: res.bibliographic_data.publication_year,
            citation: res.sort_count.citation.total,
          };
          return articleInfo;
        }),
        takeUntil(this.subscription$)
      )
      .subscribe(
        (res) => {
          this.articleInfo = res;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );

    this.dialog.open(this.articleRef, {
      panelClass: 'comment-modal',
      minWidth: '320px',
      maxWidth: '768px',
    });
  }
  public closeArticleInfoModal(): void {
    this.subscription$.next();
    this.subscription$.complete();
    this.dialog.closeAll();
  }
  public closeCommentModal(): void {
    this.dialog.closeAll();
  }
}
