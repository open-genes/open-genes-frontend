import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss']
})
export class CodeBlockComponent implements OnInit {
  @Input()
  text: string;

  constructor(
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
  }

  public copyCode(text: string) {
    document.execCommand('copy', false, text);
    console.log(text);
    this.snackBar.open('Скопировано!', '', {
      duration: 600
    });
  }
}
