import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { HintComponent } from './hint.component';

export default {
  title: 'Example/Hint',
  component: HintComponent,
  decorators: [
    moduleMetadata({
      declarations: [HintComponent],
      imports: [CommonModule],
    }),
  ],
};

const Template: Story<HintComponent> = () => ({
  component: HintComponent,
  template: `<app-hint
              hintType="emphasized">
    <ng-container title><span class="fa far fa-magic"></span> С чего начать</ng-container>
    <ng-container description>Узнайте как пользоваться поиском и фильтрами</ng-container>
    <ng-container button>
      <button class="btn btn--fill btn--small btn--white">
        Посмотреть
      </button></ng-container>
  </app-hint>`,
});
export const Base = Template.bind({});