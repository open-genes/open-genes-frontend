// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { AccordionComponent } from './accordion.component';
import { componentWrapperDecorator } from '@storybook/angular';

export default {
  title: 'Example/Accordion',
  component: AccordionComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  decorators: [
    componentWrapperDecorator(story =>
      `<div>${story}
        <h2 accordion-header>Accordion Works</h2>
        <p accordion-body>Lorem ipsum dolor sit amet.</p>
      </div>`),
  ],
} as Meta;

const Template: Story<AccordionComponent> = (args: AccordionComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Accordion',
};

