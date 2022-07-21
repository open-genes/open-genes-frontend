import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contributors-page',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss'],
})
export class ContributorsComponent {
  constructor(public translate: TranslateService) {
  }

  public members = [
    'Mikhail Batin',
    'Konstantin Rafikov',
    'Ekaterina Rafikova',
    'Olga Spiridonova',
    'Anastasia Egorova',
    'Nikolay Nemirovich-Danchenko',
    'Konstantin Dryomov',
    'Sergey Pushkin',
    'Dmitry Glubokov',
    'Yuri Ledovskiy',
    'Anna Parfenenkova',
    'Isoboy Komilzoda',
    'Said Kamolov',
    'Naim Hakimov',
    'Polina Tzabai',
    'Tatiana Skvortzova',
    'Nadejda Ivanova',
    'Mariya Stepanova',
    'Oksana Antonenko',
    'Anna Kalinina',
    'Olga Brovkina',
    'Anastasiya Poznyak',
    'Julia Belova',
    'Sergey Zheldokas',
  ];
}
