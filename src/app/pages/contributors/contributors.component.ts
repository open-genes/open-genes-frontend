import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-go-search',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss'],
})
export class ContributorsComponent {
  constructor(public translate: TranslateService) {
  }

  public names = [
    'Anastasia Egorova',
    'Mikhail Batin',
    'Konstantin Rafikov',
    'Ekaterina Rafikova',
    'Olga Spiridonova',
    'Nikolay Nemirovich-Danchenko',
    'Konstantin Dryomov',
    'Nikita Minaev',
    'Dmitry Glubokov',
    'Yuri Ledovskiy',
    'Anna Parfenenkova',
    'Isoboy Komilzoda',
    'Said Kamolov',
    'Polina Tzabai',
    'Tatiana Skvortzova',
    'Nadejda Ivanova',
    'Mariya Stepanova',
    'Oksana Antonenko',
    'Anna Kalinina',
    'Olga Brovkina',
    'Naim Hakimov',
    'Andrei Kiselev',
    'Anastasiya Poznyak',
    'Viktoria Polomoshnova',
    'Svetlana Bozrova',
    'Alexey Rzheshevskiy',
    'Leon Pesha',
    'Sergey Musienko',
    'Alena Ketova',
    'Mikhail Dyrma',
    'Roman Kungurtcev',
    'Ankitkumar Singh',
    'Bhanu Chamakuri',
    'Konstantin Sinkevich',
    'Anastasia Velikanova',
    'Natalya Andreeva',
  ];
}
