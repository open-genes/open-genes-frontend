import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { PopoverComponent } from './popover.component';

export default {
  title: 'Example/Popover',
  component: PopoverComponent,
  decorators: [
    moduleMetadata({
      declarations: [PopoverComponent],
      imports: [CommonModule],
    }),
  ],
};
const Template: Story<PopoverComponent> = () => ({
  component: PopoverComponent,
  template: `<app-popover top="20px">
    <h1 popover-header>Lorem ipsum dolor sit.</h1>
    <p popover-content>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque aut corporis <br>
    dolorem eius eveniet modi nam, necessitatibus perferendis possimus <br>
    repudiandae
    sapiente sit temporibus! Consequuntur excepturi, id illo nemo <br>
    officiis voluptatibus?
    </p>
</app-popover>`,
});
export const Base = Template.bind({});