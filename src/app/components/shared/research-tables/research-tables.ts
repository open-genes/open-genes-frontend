import { Directive, Input } from '@angular/core';
import { CommonModalComponent } from '../../ui-components/components/modals/common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AdditionalInterventionResolver } from '../../../core/utils/additional-intervention-resolver';

@Directive()
export abstract class ResearchTables extends AdditionalInterventionResolver {
  @Input() items: any;
  @Input() numberColumn: boolean;
  @Input() geneColumnOn: boolean;
  @Input() slice: number;

  protected constructor(protected dialog: MatDialog) {
    super();
  }

  public openCommentModal(title, body, template = null): void {
    this.dialog.open(CommonModalComponent, {
      data: { title: title, body: body, template: template },
      panelClass: 'comment-modal',
      minWidth: '320px',
      maxWidth: '768px',
      autoFocus: false,
    });
  }
}
