import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-help-page',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {
  constructor(public translate: TranslateService) {}
}
