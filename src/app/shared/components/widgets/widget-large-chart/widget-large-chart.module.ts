import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetLargeChartComponent } from './widget-large-chart.component';
import { ChartModule } from '../../chart/chart.module';
import { MaterialModule } from "../../../../material/material.module";


@NgModule({
  declarations: [WidgetLargeChartComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule
  ],
  exports: [WidgetLargeChartComponent]
})
export class WidgetLargeChartModule {
}
