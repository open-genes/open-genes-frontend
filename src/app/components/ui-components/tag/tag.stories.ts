import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { TagComponent } from './tag.component';

export default {
  title: 'Example/Tag',
  component: TagComponent,
  decorators: [
    moduleMetadata({
      declarations: [TagComponent],
      imports: [CommonModule],
    }),
  ],
};

const Template: Story<TagComponent> = () => ({
  component: TagComponent,
  template: `<app-tag [isActive]="true" [isMultiline]="true"><h1>Lorem ipsum dolor sit amet.</h1></app-tag>`,
});
export const Base = Template.bind({});