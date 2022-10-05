import { Component } from '@angular/core';
import { StudyTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-additional-evidences',
  templateUrl: './additional-evidences.component.html',
  styleUrls: ['./additional-evidences.component.scss'],
})
export class AdditionalEvidencesComponent extends StudyTables {
  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
