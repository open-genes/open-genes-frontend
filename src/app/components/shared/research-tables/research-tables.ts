import { Directive, Input } from '@angular/core';
import { CommonModalComponent } from '../../ui-components/components/modals/common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Directive()
export abstract class ResearchTables {
  @Input() items: any;

  protected constructor(protected dialog: MatDialog) {}

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
