import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMemberCardComponent } from './team-member-card.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    TeamMemberCardComponent,
  ],
  exports: [
    TeamMemberCardComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
  ],
})
export class TeamMemberCardModule { }
