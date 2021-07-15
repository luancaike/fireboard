import { NgModule } from '@angular/core';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
    imports: [ChartsModule, CommonModule],
    declarations: [BarChartComponent, PieChartComponent, LineChartComponent],
    exports: [BarChartComponent, PieChartComponent, LineChartComponent]
})
export class WidgetsModule {}
