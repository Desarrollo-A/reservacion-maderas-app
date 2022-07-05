import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutModule } from "../shared/layout/layout.module";
import { SidenavModule } from "../shared/layout/sidenav/sidenav.module";
import { ToolbarModule } from "../shared/layout/toolbar/toolbar.module";
import { FooterModule } from "../shared/layout/footer/footer.module";
import { ConfigPanelModule } from "../shared/components/config-panel/config-panel.module";
import { SidebarModule } from "../shared/components/sidebar/sidebar.module";
import { QuickpanelModule } from "../shared/layout/quickpanel/quickpanel.module";
import { DashboardComponent } from "./dashboard.component";


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    SidenavModule,
    ToolbarModule,
    FooterModule,
    ConfigPanelModule,
    SidebarModule,
    QuickpanelModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
