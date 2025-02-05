import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-copy-field',
  templateUrl: './copy-field.component.html',
  styleUrls: ['./copy-field.component.scss'],
})
export class CopyFieldComponent {
  @Input() value = '';
  @ViewChild('copiedMessage') copiedMessage: ElementRef;

  constructor(
    private snackBar: MatSnackBar,
    public translate: TranslateService
  ) {}

  copyToClipboard(): void {
    void navigator.clipboard
      .writeText(this.value)
      .then(() => {
        this.snackBar.open(
          this.copiedMessage.nativeElement.textContent,
          '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 600,
          }
        );
      });
  }
}
