import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackBarComponent } from './snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SnackBarComponent],
  imports: [CommonModule, TranslateModule],
})
export class SnackBarModule {}
