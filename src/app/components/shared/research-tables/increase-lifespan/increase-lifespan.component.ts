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
  public researches: PurpleTable[] = [];

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
