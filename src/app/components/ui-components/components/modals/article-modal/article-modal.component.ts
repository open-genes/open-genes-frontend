import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-article-modal',
  templateUrl: './article-modal.component.html',
  styleUrls: ['./article-modal.component.scss'],
})
export class ArticleModalComponent {
  public url = environment.openLongevity80LevelCMS;
  public defaultCover = '/assets/images/default-article-cover-big.jpg';
  public article = [];
  public maxCharacters = 300;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ArticleModalComponent>,
  ) {
    Object.values(data?.modalData?.description).forEach((item: any) => {
      this.article.push(item.content);
    });
    console.log(this.article);
  }

  public closeArticleModal(): void {
    this.dialogRef.close();
  }

  imgErrorHandler(event: any, placeholderImg: string) {
    event.target.src = placeholderImg;
  }
}
