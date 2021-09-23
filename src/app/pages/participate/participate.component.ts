import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-participate',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.scss'],
})
export class ParticipateComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [''],
      field: [''],
      message: [''],
      telegram: [''],
      email: ['']
    });
  }

  submit() {
    this.form = this.formBuilder.group({
      name: [this.form.value.name, Validators.required],
      field: [this.form.value.field, Validators.required],
      message: [this.form.value.message, Validators.required],
      telegram: [this.form.value.telegram],
      email: [this.form.value.email, [Validators.required, Validators.email]]
    });

    if (!this.form.invalid) {
      console.log(this.form.value);
    }
  }
}
