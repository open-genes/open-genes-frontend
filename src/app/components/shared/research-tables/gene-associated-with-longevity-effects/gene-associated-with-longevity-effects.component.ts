import { Component } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gene-associated-with-longevity-effects',
  templateUrl: './gene-associated-with-longevity-effects.component.html',
  styleUrls: ['./gene-associated-with-longevity-effects.component.scss'],
})
export class GeneAssociatedWithLongevityEffectsComponent extends ResearchTables {

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
