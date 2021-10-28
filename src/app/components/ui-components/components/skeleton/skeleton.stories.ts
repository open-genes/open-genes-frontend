import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { SkeletonLoaderComponent } from './skeleton.component';

export default {
  title: 'Example/Skeleton',
  component: SkeletonLoaderComponent,
  decorators: [
    moduleMetadata({
      declarations: [SkeletonLoaderComponent],
      imports: [CommonModule],
    }),
  ],
};

const Template: Story<SkeletonLoaderComponent> = () => ({
  component: SkeletonLoaderComponent,
  template: `<app-skeleton></app-skeleton>`,
});
export const Base = Template.bind({});