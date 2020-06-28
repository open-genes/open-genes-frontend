import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-expression',
  templateUrl: './expression.component.html'
})

export class ExpressionComponent implements OnInit {
  @Input() public gene: any;
  @Input() public max: number;

  constructor(public translate: TranslateService) { }

  ngOnInit() {

  }

  public chartCalculatePercent(a: number, b: number) {
    return (a / b) * 100;
  }
}
