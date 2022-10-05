import { Component } from '@angular/core';
import { StudyTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gene-associated-with-longevity-effects',
  templateUrl: './gene-associated-with-longevity-effects.component.html',
  styleUrls: ['./gene-associated-with-longevity-effects.component.scss'],
})
export class GeneAssociatedWithLongevityEffectsComponent extends StudyTables {

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }

  public fixDataTypeResponse(dataType: string): string {
    switch (dataType) {
      case '1en':
        return 'genomic';
      case '1ru':
        return 'геномные';
      case '2en':
        return 'transcriptomic';
      case '2ru':
        return 'транскриптомные';
      case '3en':
        return 'proteomic';
      case '3ru':
        return 'протеомные';
    }
  }
}
