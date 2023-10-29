import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniCardsComponent } from './mini-cards.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MiniCardsComponent],
  imports: [CommonModule, RouterModule],
  exports: [MiniCardsComponent],
})
export class MiniCardsModule {}
