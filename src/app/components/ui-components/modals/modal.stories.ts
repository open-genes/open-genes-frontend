import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Example/Modals/ConfirmModal',
  component: ConfirmModalComponent,
  decorators: [
    moduleMetadata({
      declarations: [ConfirmModalComponent],
      imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule,
        MAT_DIALOG_DATA,
      ],
    }),
  ],
};

const Template: Story<ConfirmModalComponent> = (args) => ({
  props: args,
  component: ConfirmModalComponent,
  template: `<app-confirm-modal></app-confirm-modal>`,

});
export const Base = Template.bind({})
Base.args = {
  data: {
    title: '',
    buttons: {}
  }
}
