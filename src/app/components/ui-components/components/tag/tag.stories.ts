// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { TagComponent } from './tag.component';

export default {
  title: 'Example/Tag',
  component: TagComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<TagComponent> = (args: TagComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Tag',
  template: '<app-tag></app-tag>',
};

