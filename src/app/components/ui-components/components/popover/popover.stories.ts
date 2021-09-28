// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { PopoverComponent } from './popover.component';

export default {
  title: 'Example/Popover',
  component: PopoverComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<PopoverComponent> = (args: PopoverComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Popover',
  template: '<app-popover></app-popover>',
};

