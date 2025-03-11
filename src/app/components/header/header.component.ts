import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Input,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../ui-components/icon/app-icon.component';
import { NgIf } from '@angular/common';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { BurgerMenuComponent } from '../burger-menu/burger-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    IconComponent,
    NgIf,
    RouterLinkWithHref,
    RouterLinkActive,
    BurgerMenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  @Input() region: string;
  public showAnnouncement = false;
  private favouritesSubscription: Subscription;

  constructor(
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.favouritesSubscription.unsubscribe();
  }

  public updateView(): void {
    this.cdRef.markForCheck();
  }
}
