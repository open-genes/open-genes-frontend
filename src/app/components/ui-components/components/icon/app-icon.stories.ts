// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { IconComponent } from './app-icon.component';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { IconService } from './services/app-icon.service';

export default {
  title: 'Example/Icon',
  component: IconComponent,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  decorators: [
    moduleMetadata({
      declarations: [IconComponent],
      providers: [IconService],
    })
  ],
} as Meta;

const Template: Story<IconComponent> = (args: IconComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Icon',
  template: `<app-icon
        class="footer__logo"
        staticSrc="/assets/images/logo.svg"
        size="custom"
        customWidth="60px"
        customHeight="42px"
      ></app-icon>`
};

