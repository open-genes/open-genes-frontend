import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { SpinnerComponent } from './spinner.component';

export default {
  title: 'Example/Spinner',
  component: SpinnerComponent,
  decorators: [
    moduleMetadata({
      declarations: [SpinnerComponent],
      imports: [CommonModule],
    }),
  ],
};

const Template: Story<SpinnerComponent> = () => ({
  component: SpinnerComponent,
  template: `<app-spinner></app-spinner>`,
});
export const Base = Template.bind({});