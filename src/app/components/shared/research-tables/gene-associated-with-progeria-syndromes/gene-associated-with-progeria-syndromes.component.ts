import { Component } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-gene-associated-with-progeria-syndromes',
  templateUrl: './gene-associated-with-progeria-syndromes.component.html',
  styleUrls: ['./gene-associated-with-progeria-syndromes.component.scss'],
})
export class GeneAssociatedWithProgeriaSyndromesComponent extends ResearchTables {

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
