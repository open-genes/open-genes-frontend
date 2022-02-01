import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbService } from './breadcrumb.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export default {
  title: 'Example/Breadcrumb',
  component: BreadcrumbsComponent,

  decorators: [
    moduleMetadata({
      declarations: [BreadcrumbsComponent],
      imports: [CommonModule, RouterTestingModule, TranslateModule, BrowserAnimationsModule],
      providers: [BreadcrumbService],
    }),
  ],
};

const Template: Story<BreadcrumbsComponent> = (args) => ({
  props: args,
  component: BreadcrumbsComponent,
  template: `<app-breadcrumbs></app-breadcrumbs>`,
});
export const Base = Template.bind({});
Base.args = {
  breadcrumbs: [{ label: 'home_page_breadcrumb', url: '' }],
}
