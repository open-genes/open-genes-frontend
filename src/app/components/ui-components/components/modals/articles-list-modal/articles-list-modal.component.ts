import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-articles-list-modal',
  templateUrl: './articles-list-modal.component.html',
  styleUrls: ['./articles-list-modal.component.scss']
})
export class ArticlesListModalComponent {
  public url = environment.openLongevity80LevelCMS;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ArticlesListModalComponent>,
  ) { }

  public closeArticleModal(): void {
    this.dialogRef.close();
  }

}
