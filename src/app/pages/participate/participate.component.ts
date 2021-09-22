import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-participate',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.scss']
})
export class ParticipateComponent implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      "name": new FormControl('', Validators.required),
      "region": new FormControl('', Validators.required),
      "message":  new FormControl('', Validators.required),
      "telegram": new FormControl(''),
      "email": new FormControl('', [Validators.required, Validators.email])
    });

  }

  submit() {
    console.log(this.form.value);
  }
}
