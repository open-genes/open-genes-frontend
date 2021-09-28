// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SpinnerComponent } from './spinner.component';

export default {
  title: 'Example/skeleton',
  component: SpinnerComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<SpinnerComponent> = (args: SpinnerComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'spinner',
  template: '<app-spinner></app-spinner>',
};

