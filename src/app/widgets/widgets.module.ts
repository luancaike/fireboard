import { NgModule } from '@angular/core';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LoadingWidgetComponent } from '../components/loading-widget/loading-widget.component';
import { AgGridModule } from 'ag-grid-angular';
import { ChartScrollableComponent } from '../components/chart-scrollable/chart-scrollable.component';

@NgModule({
    imports: [CommonModule, AgGridModule.withComponents([])],
    declarations: [
        BarChartComponent,
        PieChartComponent,
        LineChartComponent,
        LoadingWidgetComponent,
        ChartScrollableComponent
    ],
    exports: [BarChartComponent, PieChartComponent, LineChartComponent, LoadingWidgetComponent]
})
export class WidgetsModule {}
