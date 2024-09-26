import { Component, Input } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-age-related-changes',
  templateUrl: './age-related-changes.component.html',
  styleUrls: ['./age-related-changes.component.scss'],
})
export class AgeRelatedChangesComponent extends ResearchTables {
  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
