import { Component, HostBinding, Input } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../config/config.service';
import { map } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import { PopoverService } from '../../components/popover/popover.service';
import { Observable, of } from 'rxjs';
import { Router } from "@angular/router";

@Component({
  selector: 'vex-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Input() mobileQuery: boolean;

  @Input()
  @HostBinding('class.shadow-b')
  hasShadow: boolean;

  navigationItems = this.navigationService.items;

  isHorizontalLayout$: Observable<boolean> = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
  isVerticalLayout$: Observable<boolean> = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
  isNavbarInToolbar$: Observable<boolean> = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
  isNavbarBelowToolbar$: Observable<boolean> = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));

  megaMenuOpen$: Observable<boolean> = of(false);

  constructor(private layoutService: LayoutService,
              private configService: ConfigService,
              private navigationService: NavigationService,
              private popoverService: PopoverService,
              private router: Router) { }

  openQuickpanel(): void {
    this.layoutService.openQuickpanel();
  }

  openSidenav(): void {
    this.layoutService.openSidenav();
  }

  openSearch(): void {
    this.layoutService.openSearch();
  }
}
