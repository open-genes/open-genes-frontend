import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { IconComponent } from './app-icon.component';
import { IconService } from './services/app-icon.service';

export default {
  title: 'Example/Icon',
  component: IconComponent,
  decorators: [
    moduleMetadata({
      declarations: [IconComponent],
      imports: [CommonModule],
      providers: [IconService],
    }),
  ],
};
const Template: Story<IconComponent> = () => ({
  component: IconComponent,
  template: `<app-icon 
                staticSrc="https://www.svgrepo.com/show/173011/dna-strand.svg"
                customHeight="100px"
                customWidth="100px"
                size="lg"
                ></app-icon>`,
});
export const Base = Template.bind({});
