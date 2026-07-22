import { Component } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { PurpleTable } from '../../../../core/models/open-genes-api/studies.model';

@Component({
  selector: 'app-increase-lifespan',
  templateUrl: './increase-lifespan.component.html',
  styleUrls: ['./increase-lifespan.component.scss'],
})
export class ResearchesPageComponent extends ResearchTables {
  public researches: PurpleTable[] = [];

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }

  public setIfAnyTherapyField(sample) {
    return (
      sample.drug ||
      sample.treatmentStart ||
      sample.treatmentPeriod ||
      sample.inductionByDrugWithdrawal ||
      sample.treatmentDescription
    );
  }
}
