import { Component, Input } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

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
