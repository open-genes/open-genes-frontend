import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-download-page',
  templateUrl: './datasets-page.component.html',
  styleUrls: ['./datasets-page.component.scss'],
})
export class DatasetsPageComponent implements OnInit {
  public isParentRoute: boolean;

  constructor(private router: Router, private aRoute: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.aRoute.parent);
    //this.isParentRoute = this.aRoute.parent === 'datasets';
  }
}
