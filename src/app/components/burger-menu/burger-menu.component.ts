import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FavouritesService } from '../../core/services/favourites.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {NgIf} from "@angular/common";
import { RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { DirectivesModule } from '../../directives/directives.module';
import { MaterialModule } from '../../modules/third-party/material.module';
import { IconComponent } from '../ui-components/icon/app-icon.component';

@Component({
    selector: 'app-burger-menu',
    templateUrl: './burger-menu.component.html',
    styleUrls: ['./burger-menu.component.scss'],
    standalone: true,
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive,
    RouterLinkWithHref,
    TranslateModule,
    DirectivesModule,
    MaterialModule,
    IconComponent,
  ],
})
export class BurgerMenuComponent implements OnInit, OnDestroy {
  @Inject(Document) public document: Document;
  public isMenuVisible = false;
  public favsCounter: string;
  private subscription$ = new Subject();

  @Output() favsCounterUpdate: EventEmitter<null> = new EventEmitter();

  constructor(   
    public translate: TranslateService,
    private favouritesService: FavouritesService
  ) {}


  ngOnInit(): void {
    this.favouritesService.favLength$
      .pipe(
        takeUntil(this.subscription$)
      )
      .subscribe((counter) => {
        this.favsCounter = counter.toString();
        this.favsCounterUpdate.emit();
      });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  public toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
    if (this.isMenuVisible === true) {
      document.body.classList.add('body--still');
    } else {
      document.body.classList.remove('body--still');
    }
  }
}
