import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Researches } from '../../../core/models/open-genes-api/researches.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonModalComponent } from '../../../components/ui-components/components/modals/common-modal/common-modal.component';

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

  @ViewChild('commentModalBody') dialogRef: TemplateRef<any>;

  constructor(public translate: TranslateService, private dialog: MatDialog) {}

  ngOnInit() {
    this.isIncreaseLifespan =
      this.researches?.increaseLifespan &&
      this.researches?.increaseLifespan.length !== 0;

    this.isAgeRelatedChanges =
      this.researches?.ageRelatedChangesOfGene &&
      this.researches?.ageRelatedChangesOfGene.length !== 0;

    this.isInterventionAffectsAgingProcess =
      this.researches?.interventionToGeneImprovesVitalProcesses &&
      this.researches?.interventionToGeneImprovesVitalProcesses.length !== 0;

    this.isProteinRegulatesOtherGenes =
      this.researches?.proteinRegulatesOtherGenes &&
      this.researches?.proteinRegulatesOtherGenes.length !== 0;

    this.isGeneAssociatedWithProgeriaSyndromes =
      this.researches?.geneAssociatedWithProgeriaSyndromes &&
      this.researches?.geneAssociatedWithProgeriaSyndromes.length !== 0;

    this.isGeneAssociatedWithLongevityEffects =
      this.researches?.geneAssociatedWithLongevityEffects &&
      this.researches?.geneAssociatedWithLongevityEffects.length !== 0;

    this.isAdditionalEvidences =
      this.researches?.additionalEvidences &&
      this.researches?.additionalEvidences.length !== 0;
  }

  // TODO: DRY
  public openCommentModal(title, body, template = null): void {
    this.dialog.open(CommonModalComponent, {
      data: { title: title, body: body, template: template },
      panelClass: 'comment-modal',
      minWidth: '320px',
      maxWidth: '768px',
    });
  }
  public closeCommentModal(): void {
    this.dialog.closeAll();
  }
}
