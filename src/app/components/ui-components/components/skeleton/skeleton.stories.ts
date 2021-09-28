// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SkeletonLoaderComponent } from './skeleton.component';

export default {
  title: 'Example/Skeleton',
  component: SkeletonLoaderComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<SkeletonLoaderComponent> = (args: SkeletonLoaderComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Skeleton',
  template: '<app-popover></app-popover>',
};

