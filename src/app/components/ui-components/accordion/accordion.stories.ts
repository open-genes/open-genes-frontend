import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { AccordionComponent } from './accordion.component';
import { SafePipe } from '../../../core/pipes/general/safe.pipe';

export default {
  title: 'Example/Accordion',
  component: AccordionComponent,
  props: {
    isOpen: false,
  },
  decorators: [
    moduleMetadata({
      declarations: [AccordionComponent, SafePipe],
      imports: [CommonModule],
    }),
  ],
};

const Template: Story<AccordionComponent> = () => ({
  component: AccordionComponent,
  template: `<app-accordion [isOpen]="false">
  <ng-container accordion-header>
    <button class="badge badge-primary">Click accordion title</button>
  </ng-container>
  <ng-container accordion-body>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
    Dicta doloribus eaque nesciunt officiis soluta. Aspernatur 
    dolor eaque ex iure modi mollitia officiis quo voluptatum. 
    Dolorem odio pariatur quas repudiandae unde.
  </ng-container>
</app-accordion>`,

});
export const Base = Template.bind({});