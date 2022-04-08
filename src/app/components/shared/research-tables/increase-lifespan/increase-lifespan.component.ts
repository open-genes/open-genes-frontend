import { Component } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';
import { PurpleTable } from '../../../../core/models/open-genes-api/researches.model';

@Component({
  selector: 'app-increase-lifespan',
  templateUrl: './increase-lifespan.component.html',
  styleUrls: ['./increase-lifespan.component.scss'],
})
export class IncreaseLifespanComponent extends ResearchTables {
  constructor(protected dialog: MatDialog) {
    super(dialog);
  }

  public hasAdditionalInterventions(research: PurpleTable): boolean {
    if (!research.interventions.controlAndExperiment || !research.interventions.experiment.length) {
      return;
    }
    return research.interventions.controlAndExperiment.length > 1 || research.interventions.experiment.length > 1;
  }
}
