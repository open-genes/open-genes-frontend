import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { SafePipe } from '../../../../modules/pipes/general/safe.pipe';
import { AccordionComponent } from './accordion.component';

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
  <div accordion-header>
    <button class="badge badge-primary">Нажми меня!!</button>
  </div>
  <div accordion-body>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
    Dicta doloribus eaque nesciunt officiis soluta. Aspernatur 
    dolor eaque ex iure modi mollitia officiis quo voluptatum. 
    Dolorem odio pariatur quas repudiandae unde.
  </div>
</app-accordion>`,

});
export const Base = Template.bind({});