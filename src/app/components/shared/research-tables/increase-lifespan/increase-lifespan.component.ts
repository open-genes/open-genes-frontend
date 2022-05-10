import { Component } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-increase-lifespan',
  templateUrl: './increase-lifespan.component.html',
  styleUrls: ['./increase-lifespan.component.scss'],
})
export class IncreaseLifespanComponent extends ResearchTables {
  constructor(protected dialog: MatDialog) {
    super(dialog);
  }

  public isNoAdditionalIntervention(r: any) {
    return this.resolveAdditionalIntervention(r);
  }
}
