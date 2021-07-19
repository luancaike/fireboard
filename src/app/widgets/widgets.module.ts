import { NgModule } from '@angular/core';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { LoadingWidgetComponent } from '../components/loading-widget/loading-widget.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
    imports: [ChartsModule, CommonModule, AgGridModule.withComponents([])],
    declarations: [BarChartComponent, PieChartComponent, LineChartComponent, LoadingWidgetComponent],
    exports: [BarChartComponent, PieChartComponent, LineChartComponent, LoadingWidgetComponent]
})
export class WidgetsModule {}
