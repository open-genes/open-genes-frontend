import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {
    // A home page is not implemented yet.
    // This is a redirect to the Genes page which was a Home page before.
    void this.router.navigate(['genes']);
  }
}
