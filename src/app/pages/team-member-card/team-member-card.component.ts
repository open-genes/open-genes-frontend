import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-member-card',
  templateUrl: './team-member-card.component.html',
  styleUrls: ['./team-member-card.component.scss'],
})
export class TeamMemberCardComponent implements OnInit {
  @Input() userName: string;
  @Input() userAvatar: string = './assets/images/avatar.png';
  @Input() userWebSite: string;
  @Input() isCompact: boolean = false;
  @Input() userWork: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
