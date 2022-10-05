import { Component } from '@angular/core';
import { StudyTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-age-related-changes',
  templateUrl: './age-related-changes.component.html',
  styleUrls: ['./age-related-changes.component.scss'],
})
export class AgeRelatedChangesComponent extends StudyTables {

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
