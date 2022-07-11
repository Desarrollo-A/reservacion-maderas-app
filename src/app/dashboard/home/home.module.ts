import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MaterialModule } from "../../material/material.module";
import {
  WidgetQuickValueCenterModule
} from "../../shared/components/widgets/widget-quick-value-center/widget-quick-value-center.module";
import {
  WidgetLargeGoalChartModule
} from "../../shared/components/widgets/widget-large-goal-chart/widget-large-goal-chart.module";
import { WidgetAssistantModule } from "../../shared/components/widgets/widget-assistant/widget-assistant.module";


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    WidgetQuickValueCenterModule,
    WidgetLargeGoalChartModule,
    WidgetAssistantModule
  ]
})
export class HomeModule { }
