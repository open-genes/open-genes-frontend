import { Component } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-additional-evidences',
  templateUrl: './additional-evidences.component.html',
  styleUrls: ['./additional-evidences.component.scss'],
})
export class AdditionalEvidencesComponent extends ResearchTables {
  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
