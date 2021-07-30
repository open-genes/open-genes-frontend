import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';

@NgModule({
  declarations: [SidebarComponent, SidebarItemComponent],
  imports: [CommonModule],
  exports: [SidebarComponent, SidebarItemComponent],
})
export class SidebarModule {}
