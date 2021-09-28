// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { CodeBlockComponent } from './code-block.component';
import { moduleMetadata } from '@storybook/angular';
import { SafePipe } from '../../../../modules/pipes/general/safe.pipe';

export default {
  title: 'Example/CodeBlock',
  component: CodeBlockComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  decorators: [
    moduleMetadata({
      declarations: [SafePipe],
    }),
  ],
} as Meta;

const Template: Story<CodeBlockComponent> = (args: CodeBlockComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'CodeBlock',
  template: '<app-code-block></app-code-block>',
};

