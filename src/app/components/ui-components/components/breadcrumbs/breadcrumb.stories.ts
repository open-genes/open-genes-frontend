import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbService } from './breadcrumb.service';


export default {
  title: 'Example/Breadcrumb',
  component: BreadcrumbsComponent,

  decorators: [
    moduleMetadata({
      declarations: [BreadcrumbsComponent],
      imports: [CommonModule, RouterModule, TranslateModule],
      providers: [BreadcrumbService],
    }),
  ],
};

const Template: Story<BreadcrumbsComponent> = () => ({
  component: BreadcrumbsComponent,
  template: `<app-breadcrumbs></app-breadcrumbs>`,
});
export const Base = Template.bind({});