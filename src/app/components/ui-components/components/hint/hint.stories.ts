// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { HintComponent } from './hint.component';

export default {
  title: 'Example/Hint',
  component: HintComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<HintComponent> = (args: HintComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Hint',
  template: '<app-popover></app-popover>',
};

